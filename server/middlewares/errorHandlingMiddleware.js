export const errorHandling = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ message: err.message });
  }

  export const pageNotFound = (req, res) => {
    res.status(404).json({ message: 'Page not found' });
  } 