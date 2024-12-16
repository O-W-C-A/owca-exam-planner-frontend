// dummy.test.js - Dummy function and tests all in one file

// A basic function to be tested
function multiply(a, b) {
    return a * b;
  }

  // A second dummy function for demonstration
  function greet(name) {
    if (!name) {
      return 'Hello, stranger!';
    }
    return `Hello, ${name}!`;
  }
  
  // Jest tests for both functions
  describe('Dummy Tests', () => {
    
    // Test for the multiply function
    test('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);  // Test that 2 * 3 = 6
      expect(multiply(5, 0)).toBe(0);  // Test that 5 * 0 = 0
      expect(multiply(-1, 3)).toBe(-3);  // Test that -1 * 3 = -3
    });
  
    // Test for the greet function
    test('should greet correctly with a name', () => {
      expect(greet('John')).toBe('Hello, John!');
    });
  
    test('should greet with "Hello, stranger!" when no name is given', () => {
      expect(greet()).toBe('Hello, stranger!');
    });
  
    // Test for edge cases
    test('should handle empty string input for greet', () => {
      expect(greet('')).toBe('Hello, stranger!');
    });
  });
  