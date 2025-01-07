import itertools

# Define the available operators and their precedence
operators = {"AND": 2, "OR": 1, "NOT": 3}
variables = ['A', 'B', 'C', 'D']

# Function to perform AND operation
def and_operation(a, b):
    return a and b

# Function to perform OR operation
def or_operation(a, b):
    return a or b

# Function to perform NOT operation
def not_operation(a):
    return not a

# Function to evaluate a logical expression
def evaluate_expression(expression, values):
    def apply_operator(operators, values):
        operator = operators.pop()
        if operator == "NOT":
            a = values.pop()
            values.append(not_operation(a))
        else:
            b = values.pop()
            a = values.pop()
            if operator == "AND":
                values.append(and_operation(a, b))
            elif operator == "OR":
                values.append(or_operation(a, b))

    tokens = expression.split()
    values_stack = []
    operators_stack = []

    for token in tokens:
        if token in operators:
            while (operators_stack and operators_stack[-1] in operators and
                   operators[token] <= operators[operators_stack[-1]]):
                apply_operator(operators_stack, values_stack)
            operators_stack.append(token)
        else:
            values_stack.append(values[token])

    while operators_stack:
        apply_operator(operators_stack, values_stack)

    return values_stack.pop()

# Function to generate the truth table and find minterms and maxterms
def generate_truth_table(expression):
    minterms = []
    maxterms = []

    # Generate all possible combinations of truth values for A, B, C, and D
    for combination in itertools.product([0, 1], repeat=len(variables)):
        values = dict(zip(variables, combination))
        result = evaluate_expression(expression, values)
        index = sum(val * (2 ** idx) for idx, val in enumerate(reversed(combination)))
        
        if result:
            minterms.append(index)
        else:
            maxterms.append(index)

    return minterms, maxterms

# Main function to demonstrate the usage
def main():
    # Example boolean algebra expression
    expression = "A AND B OR NOT C AND D"

    # Generate the truth table and find minterms and maxterms
    minterms, maxterms = generate_truth_table(expression)

    # Print the results
    print(f"Expression: {expression}")
    print(f"Minterms: {minterms}")
    print(f"Maxterms: {maxterms}")

if __name__ == "__main__":
    main()