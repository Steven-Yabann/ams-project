import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css_files/update_book_status.css';

const UpdateBookStatus = () => {
    const [bookId, setBookId] = useState('');
    const [status, setStatus] = useState('');
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [studentInfo, setStudentInfo] = useState({
        studentNumber: '',
        borrowDate: '',
        returnDate: '',
        datetoReturn: ''
    });

    // Fetch books from the backend
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/books/books');
            setBooks(response.data.books);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch students from the backend
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/books/fetch-students');
            setStudents(response.data.students);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFilteredStudents = async (searchTerm) => {
        try {
            const response = await axios.get(
                `http://localhost:4000/api/fetch-students?name=${searchTerm}`
            );
            setStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching filtered students:', error);
        }
    };
    
    useEffect(() => {
        fetchBooks();
        fetchStudents();
    }, []);

    // Handle book search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle student search input
    const handleStudentSearch = async (e) => {
        const searchValue = e.target.value;
        setStudentSearchTerm(searchValue);
        await fetchFilteredStudents(searchValue);
    };

    const handleInputChange = (e) => {
        setStudentInfo({
            ...studentInfo,
            [e.target.name]: e.target.value,
        });
    };

    // Update the status of the book
    const handleUpdateStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/books/books/${bookId}/update`, { 
                status, 
                borrowedBy: {
                    studentNumber: studentInfo.studentNumber,
                    borrowDate: studentInfo.borrowDate,
                    returnDate: studentInfo.returnDate,
                    datetoReturn: studentInfo.datetoReturn
                } 
            });
            if (response.status === 200) {
                alert('Book status updated successfully');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filtered lists based on search terms
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='form-container'>
            <h2>Update Book Status</h2>
            <input
                className='select-input'
                type="text"
                placeholder="Search Book"
                value={searchTerm}
                onChange={handleSearch}
            />
            <select className="select-input" onChange={(e) => setBookId(e.target.value)}>
                <option value="">Select Book</option>
                {filteredBooks.map((book) => (
                    <option key={book._id} value={book._id}>
                        {`${book.title} by ${book.author} (ISBN: ${book.isbn})`}
                    </option>
                ))}
            </select>
            <select className="select-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="Returned">Returned</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Lost">Lost</option>
            </select>

            {/* Student search and dropdown */}
            <div className='flex-inputs'>
                <label>
                    Admission Number
                    <input
                        type="text"
                        name="studentNumber"
                        placeholder="Search Student Number"
                        value={studentSearchTerm}
                        onChange={handleStudentSearch}
                        className="input-field"
                    />
                </label>
                <select
                    className="select-input"
                    onChange={(e) => {
                        const selectedStudent = students.find(student => student._id === e.target.value);
                        if (selectedStudent) {
                            setStudentInfo({
                                ...studentInfo,
                                studentNumber: selectedStudent.studentNumber
                            });
                        }
                    }}
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {`${student.admissionNumber} - ${student.name}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Conditional fields based on status */}
            {status === 'Returned' && (
                <div className='flex-inputs'>
                    <label>
                        Date to be Returned
                        <input
                            type="date"
                            name="datetoReturn"
                            placeholder="Date to be returned"
                            value={studentInfo.datetoReturn}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                    <label>
                        Return Date
                        <input
                            type="date"
                            name="returnDate"
                            placeholder="Return Date"
                            value={studentInfo.returnDate}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                </div>
            )}

            {status === 'Borrowed' && (
                <div className='flex-inputs'>
                    <label>
                        Borrow Date
                        <input
                            type="date"
                            name="borrowDate"
                            placeholder="Borrow Date"
                            value={studentInfo.borrowDate}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                    <label>
                        Date to be Returned
                        <input
                            type="date"
                            name="datetoReturn"
                            placeholder="Date to be Returned"
                            value={studentInfo.datetoReturn}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                </div>
            )}

            <button className="submit-btn" onClick={handleUpdateStatus}>Update Status</button>
        </div>
    );
};

export default UpdateBookStatus;
