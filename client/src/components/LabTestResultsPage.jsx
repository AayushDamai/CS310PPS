import React, { useState, useEffect } from 'react';
import '../styles/LabTestResultsPage.css';

const LabTestResultsPage = ({ patientId, role }) => {
    const [labTests, setLabTests] = useState([]);
    const [newTest, setNewTest] = useState({
        testType: '',
        result: '',
        testDate: '',
    });

    // Fetch lab test results for the patient
    const fetchLabTests = async () => {
        try {
            const response = await fetch(`/api/lab-tests?patientId=${patientId}`);
            const data = await response.json();
            setLabTests(data);
        } catch (error) {
            console.error('Error fetching lab test results:', error);
        }
    };

    useEffect(() => {
        fetchLabTests();
    }, [patientId]);

    // Handle adding a new lab test (for doctors only)
    const handleAddLabTest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/lab-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId: localStorage.getItem('userId'), // Assuming doctorId is stored in localStorage
                    testType: newTest.testType,
                    result: newTest.result,
                    testDate: newTest.testDate,
                }),
            });

            if (response.ok) {
                setNewTest({ testType: '', result: '', testDate: '' });
                fetchLabTests(); // Refresh the lab test results
            } else {
                console.error('Failed to add lab test result');
            }
        } catch (error) {
            console.error('Error adding lab test result:', error);
        }
    };

    return (
        <div className="lab-test-results-page">
            <h2>Lab Test Results</h2>
            <div className="view-lab-tests">
                <table>
                    <thead>
                        <tr>
                            <th>Test Type</th>
                            <th>Result</th>
                            <th>Test Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labTests.length > 0 ? (
                            labTests.map((test) => (
                                <tr key={test.id}>
                                    <td>{test.test_type}</td>
                                    <td>{test.result}</td>
                                    <td>{new Date(test.test_date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No lab test results found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Show the form to add new lab tests only if the user is a doctor */}
            {role === 'Doctor' && (
                <div className="add-lab-test">
                    <h3>Add New Lab Test</h3>
                    <form onSubmit={handleAddLabTest}>
                        <div>
                            <label>Test Type:</label>
                            <input
                                type="text"
                                value={newTest.testType}
                                onChange={(e) => setNewTest({ ...newTest, testType: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Result:</label>
                            <input
                                type="text"
                                value={newTest.result}
                                onChange={(e) => setNewTest({ ...newTest, result: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Test Date:</label>
                            <input
                                type="date"
                                value={newTest.testDate}
                                onChange={(e) => setNewTest({ ...newTest, testDate: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Lab Test</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LabTestResultsPage;