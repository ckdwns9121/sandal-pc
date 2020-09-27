import axios from 'axios';
import { Paths } from '../../paths';

export const requestQNAList = async (token, limit, offset) => {
    const req = Paths.api + 'user/qna/list';
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        params: {
            limit, offset
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const requestQNADetail = async (token, id) => {
    const req = Paths.api + 'user/qna/view';
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: { id }
    };
    const res = await axios.get(req, config);
    return res;
}

export const requestQNADelete = async (token, id) => {
    const req = Paths.api + 'user/qna/delete';

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.post['Context-Type'] = 'application/json';

    const res = await axios.delete(req, { data: { id } });
    return res;
}

export const requestQNAStore = async (token, {
    title: subject,
    content: question,
    files: q_files
}) => {
    const req = Paths.api + 'user/qna';
    
    const formData = new FormData();
    
    formData.append('subject', subject);
    formData.append('question', question);
    formData.append('q_files', q_files);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.post['Context-Type'] = 'application/json';

    const res = await axios.post(req, formData);
    return res;
};
