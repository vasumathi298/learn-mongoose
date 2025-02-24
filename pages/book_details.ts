import Book  from '../models/book';
import BookInstance, { IBookInstance }  from '../models/bookinstance';
import express from 'express';

const router = express.Router();


/**
 * @route GET /book_dtls
 * @group resource - the details of a book
 * @param {string} id.query - the book id
 * @returns an object with the book title string, author name string, and an array of bookInstances
 * @returns 404 - if the book is not found
 * @returns 500 - if there is an error in the database
 */
router.get('/', async (req, res) => {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).send("Book ID is required");
  }

  try {
    const book = await Book.getBook(id);
    if (!book) {
      return res.status(404).send(`Book ${id} not found`);
    }

    const copies = await BookInstance.getBookDetails(id);

    res.json({
      title: book.title,
      author: book.author.name,
      copies,
    });
  } catch (err) {
    console.error(`Error fetching book ${id}:`, err);
    res.status(500).send("Internal server error");
  }
});


export default router;