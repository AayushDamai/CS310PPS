import React, { useState, useEffect } from 'react';
import '../styles/LabTestResultsPage.css';

const PatientLabTestResults = () => {
    const [labTests, setLabTests] = useState([]);
    const patientId = localStorage.getItem('userId'); // Retrieve patient ID from localStorage

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

    return (
        <div className="lab-test-results-page">
            <h2>Your Lab Test Results</h2>
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
        </div>
    );
};

export default PatientLabTestResults;