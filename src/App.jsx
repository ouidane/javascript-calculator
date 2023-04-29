import { useState} from 'react'
import { evaluate } from "mathjs";

const calcData = [
  { id: "clear", value: "AC" },
  { id: "divide", value: "/" },
  { id: "multiply", value: "x" },
  { id: "seven", value: 7 },
  { id: "eight", value: 8 },
  { id: "nine", value: 9 },
  { id: "subtract", value: "-" },
  { id: "four", value: 4 },
  { id: "five", value: 5 },
  { id: "six", value: 6 },
  { id: "add", value: "+" },
  { id: "one", value: 1 },
  { id: "two", value: 2 },
  { id: "three", value: 3 },
  { id: "equals", value: "=" },
  { id: "zero", value: 0 },
  { id: "decimal", value: "." },
];
const operators = ["/", "x", "+", "-"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const App = () => {
  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("");

  const handleSubmit = () => {
    if (output.includes("=") || output === "NaN") {
      return
    };

    const lastChat = output.charAt(output.length - 1);
    const lastChatIsOperator = operators.includes(lastChat);

    if (lastChatIsOperator) {
        setInput("NaN");
        setOutput("NaN");
        return
    }

    const validResult = output.replace("x", "*")  
    const total = evaluate(validResult);

    setInput(`${total}`);
    setOutput(lastOutput => `${lastOutput} = ${total}`);
  };

  const handleClear = () => {
    setInput("0");
    setOutput("");
  };

  const handleNumbers = (value) => {
    if (output.includes("=") || output === "NaN") {
        setInput("");
        setOutput("");
    };

    if (!output.length) {
      setInput(`${value}`);
      setOutput(`${value}`);
    } else {
      if (value === 0 && (output === "0" || input === "0")) {
        setOutput(lastOutput => `${lastOutput}`);
      } else {
        const lastChat = output.charAt(output.length - 1);
        const isLastChatOperator = operators.includes(lastChat);

        setInput(lastInput => (isLastChatOperator ? `${value}` : `${lastInput}${value}`));
        setOutput(lastOutput => `${lastOutput}${value}`);
      }
    }
  };

  const dotOperator = () => {
    if (output.includes("=") || output === "NaN") {
        return
    }
    if (!output.length) {
      setInput("0.");
      setOutput("0.");
    } else {
      const lastChat = output.charAt(output.length - 1);
      if (operators.includes(lastChat)) {
        setInput("0.");
        setOutput(lastOutput => `${lastOutput}0.`);
      } else {
        setInput(lastInput => (lastInput.includes(".") ? `${lastInput}` : `${lastInput}.`));
        setOutput(lastOutput => (input.includes(".") ? `${lastOutput}` : `${lastOutput}.`));
      }
    }
  };


  const handleOperators = (value) => {
    if (output === "NaN") {
        return
    };
    
    if (output.includes("=")) {
        setOutput(input);
    }
    
    if (output.length) {
      setInput(`${value}`);
      
      const beforeLastChat = output.charAt(output.length - 2);
      const beforeLastChatIsOperator = operators.includes(beforeLastChat);
      const lastChat = output.charAt(output.length - 1);
      const lastChatIsOperator = operators.includes(lastChat);
      
      if (
        (lastChatIsOperator && value !== "-") ||
        beforeLastChatIsOperator && lastChatIsOperator
      ) {
        if (beforeLastChatIsOperator) {
          const updatedValue = `${output.substring(
            0,
            output.length - 2
          )}${value}`;
          setOutput(updatedValue);
        } else {
            setOutput(lastOutput => `${lastOutput.substring(0, lastOutput.length - 1)}${value}`);
        }
      } else {
        setOutput(lastOutput => `${lastOutput}${value}`);
      }
    }
  };

  const handleInput = (value) => {
    const number = numbers.find((num) => num === value);
    const operator = operators.find((op) => op === value);

    switch (value) {
      case "=":
        handleSubmit();
        break;
      case "AC":
        handleClear();
        break;
      case number:
        handleNumbers(value);
        break;
      case ".":
        dotOperator(value);
        break;
      case operator:
        handleOperators(value);
        break;
    }
  };

  return (
      <div className="calculator">
        <div>
          <div className="formulaScreen">{output}</div>
          <div id="display" className="outputScreen">{input}</div>
        </div>
        <div className='keyboord'>
          {calcData.map(({id, value}) => (
            <button key={id} id={id} onClick={() => handleInput(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
  );
}

export default App