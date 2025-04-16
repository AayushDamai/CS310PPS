import React, { useState, useEffect } from 'react';
import '../styles/LabTestResultsPage.css';

const DoctorLabTestResults = () => {
    const [activeTab, setActiveTab] = useState('view'); // State to track the active tab
    const [labTests, setLabTests] = useState([]);
    const [newTest, setNewTest] = useState({
        patientId: '',
        testType: '',
        result: '',
        testDate: '',
    });

    // Fetch all lab test results
    const fetchLabTests = async () => {
        try {
            const response = await fetch('/api/lab-tests?doctorId=' + localStorage.getItem('userId'));
            const data = await response.json();
            setLabTests(data);
        } catch (error) {
            console.error('Error fetching lab test results:', error);
        }
    };

    useEffect(() => {
        fetchLabTests();
    }, []);

    // Handle adding a new lab test
    const handleAddLabTest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/lab-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newTest,
                    doctorId: localStorage.getItem('userId'),
                }),
            });

            if (response.ok) {
                alert('Lab test added successfully!');
                setNewTest({ patientId: '', testType: '', result: '', testDate: '' });
                fetchLabTests(); // Refresh the lab test results
                setActiveTab('view'); // Switch back to the "Lab Test Results" tab
            } else {
                console.error('Failed to add lab test result');
                alert('Failed to add lab test result.');
            }
        } catch (error) {
            console.error('Error adding lab test result:', error);
            alert('Error adding lab test result.');
        }
    };

    return (
        <div className="lab-test-results-page">
            <h2>Lab Test Management</h2>

            {/* Tabs */}
            <div className="sub-tabs">
                <button
                    className={activeTab === 'view' ? 'active-link' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    Lab Test Results
                </button>
                <button
                    className={activeTab === 'add' ? 'active-link' : ''}
                    onClick={() => setActiveTab('add')}
                >
                    Add New Lab Test
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'view' && (
                    <div className="view-lab-tests">
                        <h3>Lab Test Results</h3>
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

                {activeTab === 'add' && (
                    <div className="add-lab-test">
                        <h3>Add New Lab Test</h3>
                        <form onSubmit={handleAddLabTest}>
                            <div>
                                <label>Patient ID:</label>
                                <input
                                    type="text"
                                    value={newTest.patientId}
                                    onChange={(e) => setNewTest({ ...newTest, patientId: e.target.value })}
                                    required
                                />
                            </div>
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
        </div>
    );
};

export default DoctorLabTestResults;