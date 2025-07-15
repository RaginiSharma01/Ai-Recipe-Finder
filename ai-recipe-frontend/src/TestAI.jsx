import { useState } from 'react';
import { getInstructions } from './api/ai';

const TestAI = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const testModel = async () => {
    setLoading(true);
    setOutput('Generating...');
    try {
      const res = await getInstructions('Butter Chicken');
      setOutput(res);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={testModel} disabled={loading}>
        🔍 Test AI API
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{output}</pre>
    </div>
  );
};

export default TestAI;
