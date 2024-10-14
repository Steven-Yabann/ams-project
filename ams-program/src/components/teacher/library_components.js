import { Book } from 'lucide-react';
import { useState } from 'react';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

// Mock data for borrowed books with sample image URLs
const initialBooks = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowDate: '2023-09-01', returnDate: '2023-09-15', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn5xkKB1ByJI59VpGEBBkkFRN0_FJ9COkr2g&s' },
  { id: 2, title: '1984', author: 'George Orwell', borrowDate: '2023-09-05', returnDate: '2023-09-19', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu0XxjTIT_op9XOh7KYWvkfR98D-i6D7BaCA&s' },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowDate: '2023-09-10', returnDate: '2023-09-24', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8da7bcIfu6BirVzAlrX9nwSpgPxE_MFZo8A&s' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', borrowDate: '2023-09-15', returnDate: '2023-09-29', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGDJgc8Ix58XILhu8wZE4VUoey47IJm3h95g&s' },
];

const LibraryComponent = () => {
  const [books] = useState(initialBooks);

  const calculateDaysLeft = (returnDate) => {
    const today = new Date();
    const return_date = new Date(returnDate);
    const timeDiff = return_date.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to view book details
    </Tooltip>
  );

  return (
    <div className="library-component container py-5">
      <h2 className="mb-4 text-center font-weight-bold text-primary">My Library</h2>
      <div className="card shadow border-0 rounded-lg">
        <div className="card-body bg-light">
          <h3 className="card-title mb-4 text-center text-secondary">Currently Borrowed Books</h3>
          {books.length === 0 ? (
            <p className="text-center text-muted">You have no borrowed books at the moment.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Book Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Borrowed On</th>
                    <th>Return By</th>
                    <th>Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td>
                        <div
                          className="book-cover-container"
                          style={{
                            width: '80px',
                            height: '120px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease-in-out',
                          }}
                        >
                          {book.imageUrl ? (
                            <Image 
                              src={book.imageUrl} 
                              fluid 
                              alt={book.title} 
                              style={{ 
                                objectFit: 'cover', 
                                width: '100%', 
                                height: '100%' 
                              }} 
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary">
                              <Book size={40} className="text-white" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <OverlayTrigger placement="top" overlay={renderTooltip}>
                          <span className="fw-bold text-primary">{book.title}</span>
                        </OverlayTrigger>
                      </td>
                      <td className="text-muted">{book.author}</td>
                      <td>{book.borrowDate}</td>
                      <td>{book.returnDate}</td>
                      <td>
                        <span className={`badge ${calculateDaysLeft(book.returnDate) <= 3 ? 'bg-danger' : 'bg-success'} p-2`}>
                          {calculateDaysLeft(book.returnDate)} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryComponent;
