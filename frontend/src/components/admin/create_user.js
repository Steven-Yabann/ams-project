import React from "react";
import { useState } from "react";
import './css_files/create_user.css'

export default function Create_user(){

    const [studentInfo, setStudentInfo] = useState({
        name: '',
        adm_no: '',
        student_identification: '',
        student_email: '',
        mother_name: '',
        father_name: '',
        mother_id: '',
        father_id: '',
        mother_email: '',
        father_email: '',
    })

    const [employeeInfo, setEmployeeInfo] = useState({
        name: '',
        identification_no: '',
        email: '',
        phone_no: '',
        role: '',
        department: '',

    })

    const [status, setStatus] = useState('');

    const handleInput = (e, formType) => {
        const {name, value} = e.target
        
        if (formType === 'Student') {
            setStudentInfo({
                ...studentInfo,
                [name] : value
            })
        }
        else if ( formType === 'Employee') {
            setEmployeeInfo({
                ...employeeInfo,
                [name] : value
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (status === 'Student') {
            // Backend work for storing data to DB
            console.log('Student details submitted successfully')
        }
        else if(status === 'Employee') {
            //...
            console.log('Employee details submitted successfully')
        }
    }

    return (
        <div className="form-container">
            <h1>Create a new user:</h1>
            <select className="select-status" value={status} onChange={ (e) => setStatus(e.target.value) }>
                <option value='Student'>Student</option>
                <option value='Employee'>Employee</option>
            </select>

            {status === 'Student' && (
                <form className="form" onSubmit={handleSubmit}>
                    <h3>Student Information</h3>
                    <div className="flex-inputs">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={studentInfo.name}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Admission Number:
                        <input
                            type="text"
                            name="adm_no"
                            value={studentInfo.adm_no}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <div className="flex-inputs">
                    <label>
                        Student Identification:
                        <input
                            type="text"
                            name="student_identification"
                            value={studentInfo.student_identification}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Student Email:
                        <input
                            type="email"
                            name="student_email"
                            value={studentInfo.student_email}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <div className="flex-inputs">
                    <label>
                        Mother's Name:
                        <input
                            type="text"
                            name="mother_name"
                            value={studentInfo.mother_name}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Father's Name:
                        <input
                            type="text"
                            name="father_name"
                            value={studentInfo.father_name}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <div className="flex-inputs">
                    <label>
                        Mother's ID:
                        <input
                            type="text"
                            name="mother_id"
                            value={studentInfo.mother_id}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Father's ID:
                        <input
                            type="text"
                            name="father_id"
                            value={studentInfo.father_id}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <div className="flex-inputs">
                    <label>
                        Mother's Email:
                        <input
                            type="email"
                            name="mother_email"
                            value={studentInfo.mother_email}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Father's Email:
                        <input
                            type="email"
                            name="father_email"
                            value={studentInfo.father_email}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <button type="submit" className="submit-btn">Submit Student</button>
                </form>
            )}

            {status === 'Employee' && (
                <form onSubmit={handleSubmit}>
                    <h3>Employee Information</h3>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={employeeInfo.name}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Identification Number:
                        <input
                            type="text"
                            name="identification_no"
                            value={employeeInfo.identification_no}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <div className="flex-inputs">
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={employeeInfo.email}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            name="phone_no"
                            value={employeeInfo.phone_no}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <div className="flex-inputs">
                    <br />
                    <label>
                        Role:
                        <input
                            type="text"
                            name="role"
                            value={employeeInfo.role}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Department:
                        <input
                            type="text"
                            name="department"
                            value={employeeInfo.department}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    </div>
                    <br />
                    <button type="submit" className="submit-btn">Submit Employee</button>
                </form>
            )}
        </div>
    )
}
