import React, { useEffect, useState } from 'react';
import '../css_files/view_book_records.css';
const ViewBookRecords = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBooks = async () => {
        try {
            const response = await bookService.getAllBooks();
            setBooks(response.data.books);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="content">
            <h2>Book Records</h2>
            <input 
                type="text" 
                placeholder="Search by Title" 
                value={searchTerm} 
                onChange={handleSearch} 
                className="search-bar"
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Available</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book, index) => (
                        <tr key={index}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBookRecords;
