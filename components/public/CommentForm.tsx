import React from 'react';

const CommentForm: React.FC = () => {
    return (
        <form>
            <textarea placeholder="Add a comment (Under Construction)..." disabled></textarea>
            <button type="submit" disabled>Submit</button>
        </form>
    );
};

export default CommentForm;
