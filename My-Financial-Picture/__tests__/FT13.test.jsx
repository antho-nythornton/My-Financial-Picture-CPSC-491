import React from 'react'
import { useState } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import Planner from '../src/pages/Planner'
import { AuthProvider } from '../src/context/AuthContext'

vi.mock('../src/lib/api', () => {
  return {
    default: {
      post: vi.fn((url) => {
        if (url === '/login') {
          return Promise.resolve({
            data: {
              message: 'Login successful',
              user_id: 42,
              first_name: 'Test',
              last_name: 'User',
            },
          })
        }
        return Promise.reject(new Error(`Unexpected API call: ${url}`))
      }),
    },
  }
})

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

describe('FT13 - Planner Component Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('mfp_auth', JSON.stringify({
      isAuthed: true,
      userId: 42,
      firstName: 'Test',
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderPlanner = () => {
    return render(
      <MemoryRouter initialEntries={['/planner']}>
        <AuthProvider>
          <Planner />
        </AuthProvider>
      </MemoryRouter>
    )
  }

  // ===== CALENDAR VIEW TESTS =====
  describe('Calendar View and Interaction', () => {
    test('should display the calendar view with current month and year', () => {
      renderPlanner()
      const today = new Date()
      const monthYear = `${MONTHS[today.getMonth()]} ${today.getFullYear()}`
      expect(screen.getByText(monthYear)).toBeInTheDocument()
    })

    test('should display all day names in the calendar', () => {
      renderPlanner()
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      dayNames.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument()
      })
    })

    test('should display calendar days for the current month', () => {
      renderPlanner()
      const today = new Date()
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
      for (let day = 1; day <= Math.min(5, daysInMonth); day++) {
        expect(screen.getByText(day.toString())).toBeInTheDocument()
      }
    })

    test('should highlight today\'s date', () => {
      renderPlanner()
      const today = new Date().getDate()
      const todayElement = screen.getByText(today.toString()).closest('.calendar-day')
      expect(todayElement).toHaveClass('today')
    })

    test('should navigate to previous month when left arrow is clicked', () => {
      renderPlanner()
      const buttons = screen.getAllByRole('button')
      const prevButton = buttons.find(btn => btn.textContent.includes('←'))
      fireEvent.click(prevButton)

      const today = new Date()
      const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const expectedMonth = `${MONTHS[prevDate.getMonth()]} ${prevDate.getFullYear()}`
      expect(screen.getByText(expectedMonth)).toBeInTheDocument()
    })

    test('should navigate to next month when right arrow is clicked', () => {
      renderPlanner()
      const buttons = screen.getAllByRole('button')
      const nextButton = buttons.find(btn => btn.textContent.includes('→'))
      fireEvent.click(nextButton)

      const today = new Date()
      const nextDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      const expectedMonth = `${MONTHS[nextDate.getMonth()]} ${nextDate.getFullYear()}`
      expect(screen.getByText(expectedMonth)).toBeInTheDocument()
    })

    test('should have clickable calendar day elements', () => {
      renderPlanner()
      const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
      expect(calendarDays.length).toBeGreaterThan(0)
      calendarDays.forEach(day => {
        expect(day.className).toContain('calendar-day')
      })
    })

    test('should navigate between multiple months correctly', () => {
      renderPlanner()
      const buttons = screen.getAllByRole('button')
      const nextButton = buttons.find(btn => btn.textContent.includes('→'))
      const prevButton = buttons.find(btn => btn.textContent.includes('←'))

      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)

      fireEvent.click(prevButton)
      fireEvent.click(prevButton)

      const today = new Date()
      const expectedDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      const expectedMonth = `${MONTHS[expectedDate.getMonth()]} ${expectedDate.getFullYear()}`
      expect(screen.getByText(expectedMonth)).toBeInTheDocument()
    })
  })

  // ===== SAVING GOALS MENU TESTS =====
  describe('Savings Goals Menu and Management', () => {
    test('should display the Saving Goals section', () => {
      renderPlanner()
      expect(screen.getByText('Saving Goals')).toBeInTheDocument()
    })

    test('should display an "Add Goal" button', () => {
      renderPlanner()
      expect(screen.getByRole('button', { name: /\+ Add Goal/i })).toBeInTheDocument()
    })

    test('should display empty state message when no goals exist', () => {
      renderPlanner()
      expect(screen.getByText('No goals yet. Create your first saving goal!')).toBeInTheDocument()
    })

    test('should display the goals list container', () => {
      renderPlanner()
      const goalsSection = screen.getByText('Saving Goals').closest('.goals-section')
      expect(goalsSection).toBeInTheDocument()
    })
  })

  // ===== CREATE NEW GOAL TESTS =====
  describe('Create New Saving Goals', () => {
    test('should open a modal when "Add Goal" button is clicked', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })
    })

    test('should display form fields in the modal', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g., Emergency Fund')).toBeInTheDocument()
        expect(screen.getAllByPlaceholderText('0.00')[0]).toBeInTheDocument()
        expect(screen.getAllByPlaceholderText('0.00')[1]).toBeInTheDocument()
        expect(document.querySelector('input[type="date"]')).toBeInTheDocument()
      })
    })

    test('should successfully create a new goal with all fields', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })

      const nameInput = screen.getByPlaceholderText('e.g., Emergency Fund')
      const targetInput = screen.getAllByPlaceholderText('0.00')[0]
      const currentInput = screen.getAllByPlaceholderText('0.00')[1]

      await user.type(nameInput, 'Emergency Fund')
      await user.type(targetInput, '5000')
      await user.type(currentInput, '1000')

      const createButton = screen.getByRole('button', { name: /Create Goal/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
      })
    })

    test('should create a goal with minimum required fields', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })

      const nameInput = screen.getByPlaceholderText('e.g., Emergency Fund')
      const targetInput = screen.getAllByPlaceholderText('0.00')[0]

      await user.type(nameInput, 'Vacation')
      await user.type(targetInput, '3000')

      const createButton = screen.getByRole('button', { name: /Create Goal/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Vacation')).toBeInTheDocument()
      })
    })

    test('should display goal details after creation', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })

      const nameInput = screen.getByPlaceholderText('e.g., Emergency Fund')
      const targetInput = screen.getAllByPlaceholderText('0.00')[0]
      const currentInput = screen.getAllByPlaceholderText('0.00')[1]

      await user.type(nameInput, 'New Car')
      await user.type(targetInput, '25000')
      await user.type(currentInput, '5000')

      const createButton = screen.getByRole('button', { name: /Create Goal/i })
      await user.click(createButton)
      await waitFor(() => {
        expect(screen.getByText('New Car')).toBeInTheDocument()
        expect(screen.getByText('$5000.00')).toBeInTheDocument()
        expect(screen.getByText('$25000.00')).toBeInTheDocument()
      })
    })

    test('should calculate and display progress percentage correctly', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })

      const nameInput = screen.getByPlaceholderText('e.g., Emergency Fund')
      const targetInput = screen.getAllByPlaceholderText('0.00')[0]
      const currentInput = screen.getAllByPlaceholderText('0.00')[1]

      await user.type(nameInput, 'Progress Test')
      await user.type(targetInput, '1000')
      await user.type(currentInput, '500')

      const createButton = screen.getByRole('button', { name: /Create Goal/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('50% complete')).toBeInTheDocument()
      })
    })

    test('should close modal when Cancel button is clicked', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Create Saving Goal')).not.toBeInTheDocument()
      })
    })

    test('should create multiple goals and display all of them', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i })

      await user.click(addButton)
      await waitFor(() => expect(screen.getByText('Create Saving Goal')).toBeInTheDocument())

        await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Goal 1')
        await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000')
      await user.click(screen.getByRole('button', { name: /Create Goal/i }))

      await waitFor(() => expect(screen.getByText('Goal 1')).toBeInTheDocument())

      await user.click(addButton)
      await waitFor(() => expect(screen.getByText('Create Saving Goal')).toBeInTheDocument())

        await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Goal 2')
        await user.type(screen.getAllByPlaceholderText('0.00')[0], '2000')
      await user.click(screen.getByRole('button', { name: /Create Goal/i }))

      await waitFor(() => {
        expect(screen.getByText('Goal 1')).toBeInTheDocument()
        expect(screen.getByText('Goal 2')).toBeInTheDocument()
      })
    })
  })

  // ===== DELETE GOAL TESTS =====
  describe('Delete Saving Goals', () => {
    test('should display delete button for each goal', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Delete Test');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: '×' });
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    test('should delete a goal when delete button is clicked', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Goal to Delete');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Goal to Delete')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByRole('button', { name: '×' });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Goal to Delete')).not.toBeInTheDocument();
      });
    });

    test('should return to empty state after deleting all goals', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Only Goal');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Only Goal')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByRole('button', { name: '×' });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('No goals yet. Create your first saving goal!')).toBeInTheDocument();
      });
    });

    test('should delete correct goal when multiple goals exist', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      
      // Create Goal 1
      await user.click(addButton);
      await waitFor(() => expect(screen.getByText('Create Saving Goal')).toBeInTheDocument());
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Keep This');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => expect(screen.getByText('Keep This')).toBeInTheDocument());
      
      // Create Goal 2
      await user.click(addButton);
      await waitFor(() => expect(screen.getByText('Create Saving Goal')).toBeInTheDocument());
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Delete This');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '2000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => expect(screen.getByText('Delete This')).toBeInTheDocument());
      
      // Delete Goal 2
      const deleteButtons = screen.getAllByRole('button', { name: '×' });
      await user.click(deleteButtons[deleteButtons.length - 1]);
      
      await waitFor(() => {
        expect(screen.getByText('Keep This')).toBeInTheDocument();
        expect(screen.queryByText('Delete This')).not.toBeInTheDocument();
      });
    });
  });

  // ===== TRACK PROGRESS TESTS =====
  describe('Track Progress on Saving Goals', () => {
    test('should display progress bar for each goal', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Progress Track');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.type(screen.getAllByPlaceholderText('0.00')[1], '300');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        const progressBar = document.querySelector('.progress-bar');
        expect(progressBar).toBeInTheDocument();
      });
    });

    test('should display amount and deadline information', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Info Test');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '5000');
      await user.type(screen.getAllByPlaceholderText('0.00')[1], '2000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        expect(screen.getByText('$2000.00')).toBeInTheDocument();
        expect(screen.getByText('$5000.00')).toBeInTheDocument();
      });
    });

    test('should display correct completion percentage', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Percentage Test');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '2000');
      await user.type(screen.getAllByPlaceholderText('0.00')[1], '500');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        expect(screen.getByText('25% complete')).toBeInTheDocument();
      });
    });

    test('should display 100% when goal is fully funded', async () => {
      const user = userEvent.setup()
      renderPlanner()
      const addButton = screen.getByRole('button', { name: /\+ Add Goal/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create Saving Goal')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText('e.g., Emergency Fund'), 'Funded Goal');
      await user.type(screen.getAllByPlaceholderText('0.00')[0], '1000');
      await user.type(screen.getAllByPlaceholderText('0.00')[1], '1000');
      await user.click(screen.getByRole('button', { name: /Create Goal/i }));
      
      await waitFor(() => {
        expect(screen.getByText('100% complete')).toBeInTheDocument();
      });
    });
  });
});
