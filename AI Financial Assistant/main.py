import re
from app.logic import suggest_budget

class HoneyBun:
    def __init__(self):
        self.data = {
            "income": None,
            "fixed_expenses": None,
            "savings_goal": None,
            "months_to_goal": None
        }
        self.scenarios = []

    def extract_numbers_by_keyword(self, text):
        """
        Extract numeric values from text and map them to the right fields using keywords.
        Associates each keyword with the closest number in the sentence.
        """
        text_lower = text.lower()
        keywords = {
            "income": ["income", "earn", "salary", "make"],
            "fixed_expenses": ["fixed expense", "expenses", "bills", "cost"],
            "savings_goal": ["savings", "save", "goal", "target"],
            "months_to_goal": ["month", "months", "timeframe", "period", "duration"]
        }

        # Find all numbers with positions
        numbers = [(m.start(), m.group()) for m in re.finditer(r"\$?(\d+(?:,\d{3})*(?:\.\d+)?)", text_lower)]
        numbers = [(pos, float(n.replace(',', ''))) for pos, n in numbers]

        for key, kw_list in keywords.items():
            # Find keyword occurrences
            positions = [m.start() for kw in kw_list for m in re.finditer(r"\b" + re.escape(kw) + r"\b", text_lower)]
            if not positions:
                continue

            # Find closest number to any keyword occurrence
            closest_number = None
            min_distance = float('inf')
            for pos_kw in positions:
                for pos_num, num in numbers:
                    distance = abs(pos_kw - pos_num)
                    if distance < min_distance:
                        min_distance = distance
                        closest_number = num
            if closest_number is not None:
                self.data[key] = closest_number


    def show_current_data(self):
        print("📝 Current Financial Data:")
        for key, val in self.data.items():
            print(f"  {key.replace('_', ' ').title()}: {val if val is not None else 'Not set'}")
        print()

    def display_scenario(self, scenario, label="Scenario"):
        print(f"\n💡 {label}:")
        if isinstance(scenario, dict):
            print(f"Income: ${scenario['Income']}")
            print(f"Fixed Expenses: ${scenario['Fixed Expenses']}")
            print(f"Savings per Month: ${scenario['Savings per Month']}")
            print("Budget Allocation:")
            for category, amount in scenario["Budget Allocation"].items():
                print(f"  {category}: ${amount}")
        else:
            print(scenario)

    def compare_scenarios(self):
        if not self.scenarios:
            print("⚠️ No scenarios to compare yet.")
            return

        print("\n📊 Scenario Comparison Table:")
        print(f"{'Scenario':<10}{'Income':<10}{'Expenses':<10}{'Savings/Month':<15}{'Food':<10}{'Entertainment':<15}{'Shopping':<10}")
        print("-" * 80)
        for idx, scenario in enumerate(self.scenarios, start=1):
            if isinstance(scenario, dict):
                alloc = scenario["Budget Allocation"]
                print(f"{idx:<10}${scenario['Income']:<9}${scenario['Fixed Expenses']:<9}${scenario['Savings per Month']:<14}"
                      f"${alloc['Food']:<9}${alloc['Entertainment']:<14}${alloc['Shopping']:<9}")
        print()

    def run(self):
        print("💬 Welcome to My Financial Picture, AI Financial Assistant (HoneyBun)!")
        print("Type 'exit' to quit, 'show' to see current data, 'help' for commands, or 'compare' to see past scenarios.\n")

        while True:
            user_input = input("You: ").strip()
            lower_input = user_input.lower()

            if lower_input == 'exit':
                print("👋 Goodbye!")
                break
            elif lower_input == 'show':
                self.show_current_data()
                continue
            elif lower_input == 'help':
                print("Commands:")
                print("  show - display current financial data")
                print("  compare - show all previous scenarios side by side")
                print("  exit - quit")
                print("You can also type natural sentences with numbers and keywords, e.g.,")
                print("'I earn $4000, my fixed expenses are $1500, I want to save $2000 in 6 months.'\n")
                continue
            elif lower_input == 'compare':
                self.compare_scenarios()
                continue

            # Update values based on user input
            self.extract_numbers_by_keyword(user_input)

            # Check if all required data is present
            if None in self.data.values():
                print("⚠️ Missing some information. Current data:")
                self.show_current_data()
                continue

            # Generate budget scenario
            result = suggest_budget(
                self.data["income"],
                self.data["fixed_expenses"],
                self.data["savings_goal"],
                self.data["months_to_goal"]
            )

            # Store scenario
            self.scenarios.append(result)

            # Display result
            self.display_scenario(result, label=f"Scenario {len(self.scenarios)}")
            print("\n" + "=" * 80 + "\n")


if __name__ == "__main__":
    assistant = HoneyBun()
    assistant.run()
