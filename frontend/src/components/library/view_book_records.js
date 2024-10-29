import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css_files/view_book_records.css';
const ViewBookRecords = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        yearPublished: "",
        category: "",
        location: "",
        totalCopies: 1,
        copiesAvailable: 1,
        status: "Available"
    });

    // Function to fetch books from the backend
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/books/books');
            setBooks(response.data.books);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Function to handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to handle new book input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook(prevBook => ({
            ...prevBook,
            [name]: value
        }));
    };

    // Function to add a new book
    const handleAddBook = async (e) => {
        
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/books/books', newBook);
            if (response.status === 201) {
                setBooks([...books, response.data.book]);
                setNewBook({
                    title: "",
                    author: "",
                    isbn: "",
                    publisher: "",
                    yearPublished: "",
                    category: "",
                    location: "",
                    totalCopies: 1,
                    copiesAvailable: 1,
                    status: "Available"
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filter books based on the search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="content">
            <h2>Book Records</h2>
            
            {/* Form to add a new book */}
            <form onSubmit={handleAddBook} className="add-book-form">
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Title" 
                    value={newBook.title} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="author" 
                    placeholder="Author" 
                    value={newBook.author} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="isbn" 
                    placeholder="ISBN" 
                    value={newBook.isbn} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="publisher" 
                    placeholder="Publisher" 
                    value={newBook.publisher} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="yearPublished" 
                    placeholder="Year Published" 
                    value={newBook.yearPublished} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    value={newBook.category} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="location" 
                    placeholder="Location (Shelf No.)" 
                    value={newBook.location} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="totalCopies" 
                    placeholder="Total Copies" 
                    value={newBook.totalCopies} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="copiesAvailable" 
                    placeholder="Available Copies" 
                    value={newBook.copiesAvailable} 
                    onChange={handleInputChange} 
                    required 
                />
                <select name="status" value={newBook.status} onChange={handleInputChange} required>
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Lost">Lost</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
                <button type="submit">Add Book</button>
            </form>
            
            {/* Search bar for filtering books */}
            <input 
                type="text" 
                placeholder="Search by Title" 
                value={searchTerm} 
                onChange={handleSearch} 
                className="search-bar"
            />

            {/* Table to display book records */}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Publisher</th>
                        <th>Year</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Total Copies</th>
                        <th>Available Copies</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book, index) => (
                        <tr key={index}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.publisher}</td>
                            <td>{book.yearPublished}</td>
                            <td>{book.category}</td>
                            <td>{book.location}</td>
                            <td>{book.totalCopies}</td>
                            <td>{book.copiesAvailable}</td>
                            <td>{book.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBookRecords;
