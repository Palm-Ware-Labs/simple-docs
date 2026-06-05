# Component Examples

This page showcases various code block examples in different programming languages to demonstrate the syntax highlighting and language-specific icons.

## JavaScript

```javascript
// A simple function to greet users
function greet(name) {
  const message = `Hello, ${name}! Welcome to FlyPage.`;
  console.log(message);
  return message;
}

greet('Developer');
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

const currentUser: User = {
  id: 1,
  name: 'John Doe',
  role: 'admin'
};

function logUser(user: User): void {
  console.log(`User: ${user.name} (${user.role})`);
}
```

## Python

```python
import math

def calculate_circle_area(radius):
    """Calculates the area of a circle given its radius."""
    if radius < 0:
        raise ValueError("Radius cannot be negative")
    return math.pi * (radius ** 2)

# Example usage
radius = 5
area = calculate_circle_area(radius)
print(f"The area of a circle with radius {radius} is {area:.2f}")
```

## CSS / SCSS

```css
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
}

.card-title {
  color: var(--text-main);
  font-weight: 600;
  margin-bottom: 0.5rem;
}
```

## JSON

```json
{
  "name": "flypage",
  "version": "1.0.0",
  "description": "A modern, dark-themed documentation template.",
  "main": "index.js",
  "dependencies": {
    "react": "^18.2.0",
    "react-markdown": "^8.0.7",
    "lucide-react": "^0.263.1"
  },
  "author": "Gemini CLI"
}
```

## Bash / Shell

```bash
# Install dependencies
npm install

# Start the development server
npm run dev -- --host

# Build for production
npm run build
```

## Rust

```rust
fn main() {
    let name = "FlyPage";
    println!("Hello, {}!", name);
    
    let mut count = 0;
    loop {
        count += 1;
        if count == 5 {
            break;
        }
        println!("Count: {}", count);
    }
}
```
