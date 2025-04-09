import React, { useState, useEffect } from 'react';
import '../styles/LabTestResultsPage.css';

const LabTestResultsPage = ({ doctorId }) => {
    const [labTests, setLabTests] = useState([]);
    const [newLabTest, setNewLabTest] = useState({
        patientId: '',
        testType: '',
        result: '',
        testDate: '',
    });
    const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add'

    // Fetch lab test results
    const fetchLabTests = async () => {
        try {
            const response = await fetch(`/api/lab-tests?doctorId=${doctorId}`);
            const data = await response.json();
            setLabTests(data);
        } catch (error) {
            console.error('Error fetching lab test results:', error);
        }
    };

    useEffect(() => {
        fetchLabTests();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLabTest({ ...newLabTest, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/lab-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newLabTest, doctorId }),
            });

            if (response.ok) {
                alert('Lab test result added successfully!');
                setNewLabTest({ patientId: '', testType: '', result: '', testDate: '' });
                fetchLabTests(); // Refresh the lab test results
                setActiveTab('view'); // Switch back to the view tab
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

            {/* Tabs */}
            <div className="sub-tabs">
                <button
                    className={activeTab === 'view' ? 'active-link' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    View Lab Test Results
                </button>
                <button
                    className={activeTab === 'add' ? 'active-link' : ''}
                    onClick={() => setActiveTab('add')}
                >
                    Add lab test 
                </button>
            </div>

            {/* View Lab Test Results */}
            {activeTab === 'view' && (
                <div className="view-lab-tests">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Test Type</th>
                                <th>Result</th>
                                <th>Test Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTests.length > 0 ? (
                                labTests.map((test) => (
                                    <tr key={test.id}>
                                        <td>{test.patient_name}</td>
                                        <td>{test.test_type}</td>
                                        <td>{test.result}</td>
                                        <td>{new Date(test.test_date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No lab test results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Lab Test Result */}
            {activeTab === 'add' && (
                <div className="add-lab-test">
                    <h3>Add Lab Test Result</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Patient ID:
                            <input
                                type="text"
                                name="patientId"
                                value={newLabTest.patientId}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Test Type:
                            <input
                                type="text"
                                name="testType"
                                value={newLabTest.testType}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Result:
                            <textarea
                                name="result"
                                value={newLabTest.result}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Test Date:
                            <input
                                type="date"
                                name="testDate"
                                value={newLabTest.testDate}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <button type="submit">Add Lab Test Result</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LabTestResultsPage;