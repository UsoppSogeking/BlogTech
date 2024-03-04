import { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { getUserName, getUserPhotoUrl } from '../utils/userUtils';
import { Form, Button } from 'react-bootstrap';

const CommentForm = ({ postId, userName, updateComments }) => {
    const [commentText, setCommentText] = useState('');
    const { user } = useAuth();
    const [commentUserName, setCommentUserName] = useState('');
    const [commentUserPhotoUrl, setCommentUserPhotoUrl] = useState('');

    useEffect(() => {
        if (user) {
            getUserName(user.uid)
                .then(name => setCommentUserName(name))
                .catch(error => console.error('Erro ao recuperar nome do usuário:', error));

            getUserPhotoUrl(user.uid) // Obtenha a URL da foto do usuário
                .then(photoUrl => setCommentUserPhotoUrl(photoUrl))
                .catch(error => console.error('Erro ao recuperar URL da foto do usuário:', error));
        }
    }, [user]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!commentText.trim()) {
                return;
            }
            const docRef = await addDoc(collection(db, 'comments'), {
                text: commentText,
                postId: postId,
                userId: user.uid,
                userName: commentUserName,
                userPhotoUrl: commentUserPhotoUrl,
                createdAt: serverTimestamp()
            });
            console.log('Comentário adicionado com ID: ', docRef.id);

            updateComments();
            setCommentText('');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    }

    return (
        <Form onSubmit={handleCommentSubmit} className="comment-form">
            <Form.Group controlId="commentText">
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Digite seu comentário..."
                />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>Enviar</Button>
        </Form>
    );
}

export default CommentForm