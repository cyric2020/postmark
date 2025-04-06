$\Omega \cdots 10$

# ELEC2400 Electronic Devices and Circuits

## Lecture 1 – Circuit Theory Revision

**Course Details:**
- Course Name: ELEC2400
- Instructor: Dr. Hui Ma
- Academic Year: Semester 1, 2025
- Visual Elements:
  - Purple horizontal line across the top with UQ logo.

### Key Concepts

#### Passive Reference Configuration

**Definition:** The passive reference configuration is a fundamental concept where current enters the positive polarity of the voltage. This ensures that energy flow directionality aligns correctly for power calculations.
- **Slide Reference:** Slide 5
- Example: For a current source $ I = 5 \text{A} $ in series with a 10V source, $ P = V \cdot I = 50 \text{W} $.

#### Equations
$$ P = V \cdot I $$ (Slide 5)
- Positive power indicates energy absorption by the element; negative power implies it supplies energy.

#### Case Studies

**Configuration A (Slide 6):**
- **Circuit:** Current source of 5A, voltage source of 10V.
- **Power Calculation:** $ P = V \cdot I = 10 \text{V} \times 5\text{A} = 50 \text{W} $.

**Configuration B (Slide 6):**
- **Circuit:** Current source of -5A, voltage source of 10V.
- **Power Calculation:** $ P = V \cdot I = 10 \text{V} \times (-5\text{A}) = -50 \text{W} $.

**Configuration C (Slide 6):**
- **Circuit:** Current source of 5A, voltage source of -10V.
- **Power Calculation:** $ P = V \cdot I = (-10 \text{V}) \times 5\text{A} = -50 \text{W} $.

### Diagrams

- Slide 6: Circuit with a current source in series with a voltage source, demonstrating the passive reference configuration. Arrows indicate current flow and polarity.


@(servers.txt)
```
# servers
servers echidna,spleef

# server ips
echidna 127.0.0.1:25568
spleef 127.0.0.1:25567

# default server
default echidna
```

@(+page.js)
```js
# test
var foo = function (bar) {

  return bar++;
};
```

```css
/* style.css */
body {
  background-color: #000;
}
```

@(servers.txt)
```
# servers
servers echidna,spleef
```

@(servers.txt)
```
this
is

a

test
```

```
testing

code

qith gaps
```

superscript and subscript test

X^2^, H_2_O

this is a ==highlight== test


::: [Written Example] (edit) {example}
this is my example
:::

![test image](data:image/png;base64,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){width: 500px;}