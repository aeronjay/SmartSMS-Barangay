import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import service from '../../services/service';
import { Select, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, FormControl } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TemplateDropdown = ({ setMessage, selectedTemplate, setSelectedTemplate }) => {
    const { token } = useContext(AuthContext);
    const [templates, setTemplates] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ title: '', message: '' });
    const [editTemplate, setEditTemplate] = useState({ id: '', title: '', message: '' });

    useEffect(() => {
        fetchTemplates();
        // eslint-disable-next-line
    }, []);

    const fetchTemplates = async () => {
        try {
            const data = await service.getTemplates(token);
            setTemplates(data);
        } catch (err) {
            setTemplates([]);
        }
    };

    const handleSelect = (e) => {
        const template = templates.find(t => t._id === e.target.value);
        setSelectedTemplate(template?._id || '');
        setMessage(template?.message || '');
    };

    const handleAdd = async () => {
        await service.addTemplate(newTemplate, token);
        setOpenAdd(false);
        setNewTemplate({ title: '', message: '' });
        fetchTemplates();
    };

    const handleEdit = async () => {
        await service.updateTemplate(editTemplate.id, { title: editTemplate.title, message: editTemplate.message }, token);
        setOpenEdit(false);
        setEditTemplate({ id: '', title: '', message: '' });
        fetchTemplates();
    };

    const handleDelete = async () => {
        await service.deleteTemplate(editTemplate.id, token);
        setOpenDelete(false);
        setEditTemplate({ id: '', title: '', message: '' });
        setSelectedTemplate('');
        fetchTemplates();
        setMessage('')
    };
    const openEditModal = () => {
        const template = templates.find(t => t._id === selectedTemplate);
        if (template) setEditTemplate({ id: template._id, title: template.title, message: template.message });
        setOpenEdit(true);
    };

    const openDeleteModal = () => {
        const template = templates.find(t => t._id === selectedTemplate);
        if (template) setEditTemplate({ id: template._id, title: template.title, message: template.message });
        setOpenDelete(true);
    };

    return (
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FormControl fullWidth style={{ flex: 1 }}>
                <InputLabel>Message Template</InputLabel>
                <Select
                    value={selectedTemplate}
                    label="Message Template"
                    onChange={handleSelect}
                >
                    <MenuItem value="">None</MenuItem>
                    {templates.map(t => (
                        <MenuItem key={t._id} value={t._id}>{t.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <IconButton onClick={() => setOpenAdd(true)} title="Add Template" color="primary">
                <AddCircleIcon />
            </IconButton>
            <IconButton onClick={openEditModal} title="Edit Template" color="secondary" disabled={!selectedTemplate}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={openDeleteModal} title="Delete Template" color="error" disabled={!selectedTemplate}>
                <DeleteIcon />
            </IconButton>

            {/* Add Template Modal */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                <DialogTitle>Add Template</DialogTitle>
                <DialogContent>
                    <TextField label="Title" fullWidth margin="dense" value={newTemplate.title} onChange={e => setNewTemplate(t => ({ ...t, title: e.target.value }))} />
                    <TextField label="Message" fullWidth margin="dense" multiline rows={4} value={newTemplate.message} onChange={e => setNewTemplate(t => ({ ...t, message: e.target.value }))} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                    <Button onClick={handleAdd} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Template Modal */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogContent>
                    <TextField label="Title" fullWidth margin="dense" value={editTemplate.title} onChange={e => setEditTemplate(t => ({ ...t, title: e.target.value }))} />
                    <TextField label="Message" fullWidth margin="dense" multiline rows={4} value={editTemplate.message} onChange={e => setEditTemplate(t => ({ ...t, message: e.target.value }))} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleEdit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Template Modal */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Template</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the template "{editTemplate.title}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TemplateDropdown;
