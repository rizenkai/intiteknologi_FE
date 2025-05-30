import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

const EditInput = () => {
  // Theme context
  const { isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  
  // State untuk pilihan tipe pengujian
  const [testType, setTestType] = useState('');
  
  // State untuk pilihan kategori (mutu bahan / tipe bahan)
  const [category, setCategory] = useState('');
  
  // State untuk nilai baru yang akan ditambahkan
  const [newValue, setNewValue] = useState('');
  
  // State untuk daftar nilai yang sudah ada
  const [existingValues, setExistingValues] = useState([]);
  
  // State untuk loading dan pesan
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // State untuk dialog konfirmasi hapus
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [valueToDelete, setValueToDelete] = useState('');
  
  // Effect untuk mengambil data nilai yang sudah ada saat tipe pengujian dan kategori berubah
  useEffect(() => {
    if (testType && category) {
      fetchExistingValues();
    }
  }, [testType, category]);
  
  // Fungsi untuk mengecek apakah tombol Add dapat diklik
  const canAdd = () => {
    return !loading && newValue.trim() !== '';
  };
  
  // Fungsi untuk mengambil data nilai yang sudah ada
  const fetchExistingValues = async () => {
    setLoading(true);
    try {
      // Buat array untuk nilai default
      const defaultValues = [];
      
      // Tambahkan nilai default berdasarkan kategori dan tipe pengujian
      if (category === 'mutuBahan') {
        if (testType === 'Besi') {
          defaultValues.push({ _id: 'default-1', value: 'T 280' });
          defaultValues.push({ _id: 'default-2', value: 'T 420' });
        } else if (testType === 'Beton') {
          defaultValues.push({ _id: 'default-3', value: 'K 225' });
          defaultValues.push({ _id: 'default-4', value: 'K 250' });
          defaultValues.push({ _id: 'default-5', value: 'K 300' });
          defaultValues.push({ _id: 'default-6', value: 'K 350' });
          defaultValues.push({ _id: 'default-7', value: 'K 400' });
          defaultValues.push({ _id: 'default-8', value: 'K 450' });
          defaultValues.push({ _id: 'default-9', value: 'K 500' });
          defaultValues.push({ _id: 'default-10', value: 'K 600' });
        }
      } else if (category === 'tipeBahan') {
        if (testType === 'Besi') {
          defaultValues.push({ _id: 'default-11', value: 'BJTS (Ulir)' });
          defaultValues.push({ _id: 'default-12', value: 'BJTP (Polos)' });
        } else if (testType === 'Beton') {
          defaultValues.push({ _id: 'default-13', value: 'KUBUS' });
          defaultValues.push({ _id: 'default-14', value: 'SILINDER' });
          defaultValues.push({ _id: 'default-15', value: 'BALOK' });
          defaultValues.push({ _id: 'default-16', value: 'PAVING' });
          defaultValues.push({ _id: 'default-17', value: 'SCOUP' });
        }
      }
      
      // Ambil data dari API
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/inputs/values?testType=${testType}&category=${category}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Gabungkan data dari API dengan nilai default
      let combinedValues = [...defaultValues];
      
      if (response.data && response.data.length > 0) {
        // Filter nilai dari API yang tidak ada di nilai default
        const apiValues = response.data.filter(apiItem => {
          return !defaultValues.some(defaultItem => defaultItem.value === apiItem.value);
        });
        
        // Gabungkan nilai default dengan nilai dari API
        combinedValues = [...defaultValues, ...apiValues];
      }
      
      // Set nilai gabungan ke state
      setExistingValues(combinedValues);
    } catch (error) {
      console.error('Error fetching values:', error);
      setError('Failed to fetch existing values');
      
      // Jika terjadi error, gunakan data default saja
      const defaultValues = [];
      
      if (category === 'mutuBahan') {
        if (testType === 'Besi') {
          defaultValues.push({ _id: 'default-1', value: 'T 280' });
          defaultValues.push({ _id: 'default-2', value: 'T 420' });
        } else if (testType === 'Beton') {
          defaultValues.push({ _id: 'default-3', value: 'K 225' });
          defaultValues.push({ _id: 'default-4', value: 'K 250' });
          defaultValues.push({ _id: 'default-5', value: 'K 300' });
          defaultValues.push({ _id: 'default-6', value: 'K 350' });
          defaultValues.push({ _id: 'default-7', value: 'K 400' });
          defaultValues.push({ _id: 'default-8', value: 'K 450' });
          defaultValues.push({ _id: 'default-9', value: 'K 500' });
          defaultValues.push({ _id: 'default-10', value: 'K 600' });
        }
      } else if (category === 'tipeBahan') {
        if (testType === 'Besi') {
          defaultValues.push({ _id: 'default-11', value: 'BJTS (Ulir)' });
          defaultValues.push({ _id: 'default-12', value: 'BJTP (Polos)' });
        } else if (testType === 'Beton') {
          defaultValues.push({ _id: 'default-13', value: 'KUBUS' });
          defaultValues.push({ _id: 'default-14', value: 'SILINDER' });
          defaultValues.push({ _id: 'default-15', value: 'BALOK' });
          defaultValues.push({ _id: 'default-16', value: 'PAVING' });
          defaultValues.push({ _id: 'default-17', value: 'SCOUP' });
        }
      }
      
      setExistingValues(defaultValues);
    } finally {
      setLoading(false);
    }
  };
  
  // Fungsi untuk menambahkan nilai baru
  const handleAddValue = async () => {
    // Validasi input
    if (!newValue.trim()) {
      setError('Please enter a value');
      return;
    }
    
    // Validasi format untuk mutu bahan
    if (category === 'mutuBahan') {
      const prefix = testType === 'Besi' ? 'T' : 'K';
      if (!newValue.startsWith(prefix)) {
        setError(`Mutu Bahan for ${testType} should start with "${prefix}"`);
        return;
      }
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/inputs/values`, {
        value: newValue,
        category,
        testType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Tambahkan nilai baru ke daftar yang ditampilkan tanpa perlu fetch ulang
      const newItem = response.data;
      
      // Periksa apakah nilai sudah ada di daftar
      const valueExists = existingValues.some(item => item.value === newItem.value);
      
      // Jika nilai belum ada, tambahkan ke daftar
      if (!valueExists) {
        setExistingValues(prevValues => [newItem, ...prevValues]);
      }
      
      setSuccess('Value added successfully');
      setNewValue('');
    } catch (error) {
      console.error('Error adding value:', error);
      setError(error.response?.data?.message || 'Failed to add value');
    } finally {
      setLoading(false);
    }
  };
  
  // Fungsi untuk membuka dialog konfirmasi hapus
  const handleOpenDeleteDialog = (value) => {
    setValueToDelete(value);
    setDeleteDialog(true);
  };
  
  // Fungsi untuk menutup dialog konfirmasi hapus
  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setValueToDelete('');
  };
  
  // Fungsi untuk menghapus nilai
  const handleDeleteValue = async () => {
    if (!valueToDelete) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const itemToDelete = existingValues.find(item => item.value === valueToDelete);
      
      if (!itemToDelete) {
        setError('Item not found');
        return;
      }
      
      // Jika ID dimulai dengan 'default-', itu adalah nilai default yang tidak bisa dihapus
      if (itemToDelete._id.startsWith('default-')) {
        setError('Default values cannot be deleted');
        handleCloseDeleteDialog();
        return;
      }
      
      await axios.delete(`${API_URL}/api/inputs/values/${itemToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Value deleted successfully');
      fetchExistingValues();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting value:', error);
      setError(error.response?.data?.message || 'Failed to delete value');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', fontFamily: 'Open Sans, Arial, Helvetica, sans-serif', color: isDarkMode ? '#fff' : '#333', backgroundImage: "url('/Frame211332.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: isDarkMode ? '#090d1f' : '#f7f7f7', overflowX: 'hidden' }}>
      {/* Overlay gradient agar teks tetap jelas */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: isDarkMode ? 'radial-gradient(ellipse at 60% 40%, rgba(65,227,255,0.18) 0%, rgba(59,130,246,0.16) 40%, rgba(9,13,31,0.8) 100%)' : 'radial-gradient(ellipse at 60% 40%, rgba(65,227,255,0.18) 0%, rgba(59,130,246,0.16) 40%, rgba(247,247,247,0.8) 100%)', pointerEvents: 'none' }} />
      
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, pt: 5, position: 'relative', zIndex: 1 }}>
        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        
        {/* Alert untuk pesan error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', backdropFilter: 'blur(10px)', background: isDarkMode ? 'rgba(20,32,54,0.68)' : 'rgba(255,255,255,0.9)', border: `1.5px solid ${isDarkMode ? 'rgba(59,130,246,0.18)' : 'rgba(25,118,210,0.18)'}`, color: isDarkMode ? '#fff' : '#333', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: muiTheme.palette.primary.main }}>Edit Input Options</Typography>
            <Tooltip title={
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Petunjuk Penggunaan:</Typography>
                <Typography variant="body2">1. Pilih tipe pengujian (Besi/Beton)</Typography>
                <Typography variant="body2">2. Pilih kategori (Mutu Bahan/Tipe Bahan)</Typography>
                <Typography variant="body2">3. Masukkan nilai baru dan klik Add</Typography>
                <Typography variant="body2">4. Untuk menghapus nilai, klik ikon hapus</Typography>
              </Box>
            } arrow placement="right">
              <IconButton size="small" sx={{ ml: 1, color: isDarkMode ? '#41e3ff' : muiTheme.palette.primary.main }}>
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2, color: muiTheme.palette.primary.main, fontWeight: 600 }}>
            1. Pilih Tipe Pengujian
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={testType}
              onChange={(e) => {
                setTestType(e.target.value);
                setCategory('');
                setNewValue('');
                setExistingValues([]);
              }}
              displayEmpty
              sx={{ 
                color: isDarkMode ? '#fff' : '#333', 
                bgcolor: isDarkMode ? '#162336' : '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? 'rgba(65,227,255,0.5)' : 'rgba(25,118,210,0.5)' },
                '& .MuiSvgIcon-root': { color: isDarkMode ? '#41e3ff' : '#333' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: isDarkMode ? '#162336' : '#fff' }
                }
              }}
            >
              <MenuItem value="" disabled sx={{ color: isDarkMode ? '#b5eaff' : '#333' }}>
                <em>Pilih Tipe Pengujian</em>
              </MenuItem>
              <MenuItem value="Besi" sx={{ color: isDarkMode ? '#fff' : '#333' }}>Besi</MenuItem>
              <MenuItem value="Beton" sx={{ color: isDarkMode ? '#fff' : '#333' }}>Beton</MenuItem>
            </Select>
          </FormControl>
          
          {testType && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: muiTheme.palette.primary.main, fontWeight: 600 }}>
                2. Pilih Kategori
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 3, '& .MuiFormLabel-root': { color: isDarkMode ? '#b5eaff' : muiTheme.palette.primary.main } }}>
                <RadioGroup
                  row
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setNewValue('');
                    setExistingValues([]);
                  }}
                  sx={{ '& .MuiFormControlLabel-label': { color: isDarkMode ? '#fff' : '#333' } }}
                >
                  <FormControlLabel 
                    value="mutuBahan" 
                    control={<Radio sx={{ color: isDarkMode ? '#41e3ff' : muiTheme.palette.primary.main, '&.Mui-checked': { color: isDarkMode ? '#41e3ff' : muiTheme.palette.primary.main } }} />} 
                    label="Mutu Bahan" 
                  />
                  <FormControlLabel 
                    value="tipeBahan" 
                    control={<Radio sx={{ color: isDarkMode ? '#41e3ff' : muiTheme.palette.primary.main, '&.Mui-checked': { color: isDarkMode ? '#41e3ff' : muiTheme.palette.primary.main } }} />} 
                    label="Tipe Bahan" 
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}
          
          {testType && category && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: muiTheme.palette.primary.main, fontWeight: 600 }}>
                3. Input {category === 'mutuBahan' ? 'Mutu Bahan' : 'Tipe Bahan'} Baru
              </Typography>
              
              <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  label="New Value"
                  variant="outlined"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      color: isDarkMode ? '#fff' : '#333',
                      '& fieldset': { borderColor: isDarkMode ? 'rgba(65,227,255,0.5)' : 'rgba(25,118,210,0.5)' },
                      '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(65,227,255,0.8)' : 'rgba(25,118,210,0.8)' },
                      '&.Mui-focused fieldset': { borderColor: muiTheme.palette.primary.main }
                    },
                    '& .MuiInputLabel-root': { color: isDarkMode ? '#b5eaff' : muiTheme.palette.primary.main }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddValue}
                  disabled={!canAdd()}
                  sx={{ 
                    bgcolor: muiTheme.palette.primary.main, 
                    color: isDarkMode ? '#111a2b' : '#fff', 
                    fontWeight: 700, 
                    '&:hover': { bgcolor: isDarkMode ? '#1ec6e6' : '#1976d2' },
                    minWidth: { xs: '100%', sm: 120 }
                  }}
                >
                  Add
                </Button>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: isDarkMode ? '#b5eaff' : muiTheme.palette.primary.main }}>Current Values:</Typography>
              
              {loading && existingValues.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress sx={{ color: muiTheme.palette.primary.main }} />
                </Box>
              ) : existingValues.length === 0 ? (
                <Typography sx={{ color: isDarkMode ? '#b5eaff' : muiTheme.palette.text.secondary, fontStyle: 'italic', textAlign: 'center', my: 2 }}>
                  Belum ada data
                </Typography>
              ) : (
                <Paper variant="outlined" sx={{ mb: 3, maxHeight: 300, overflow: 'auto', borderColor: isDarkMode ? 'rgba(65,227,255,0.3)' : 'rgba(25,118,210,0.3)', bgcolor: isDarkMode ? 'rgba(9,13,31,0.5)' : 'rgba(255,255,255,0.5)' }}>
                  <List sx={{ '& .MuiListItem-root': { borderBottom: `1px solid ${isDarkMode ? 'rgba(65,227,255,0.1)' : 'rgba(25,118,210,0.1)'}` } }}>
                    {existingValues.map((item, index) => (
                      <ListItem key={item._id || index}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(item.value)} sx={{ color: isDarkMode ? '#f87171' : '#ef4444' }}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={item.value} sx={{ '& .MuiTypography-root': { color: isDarkMode ? '#fff' : '#333' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </>
          )}
        </Paper>
      </Box>
      
      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? 'rgba(20,32,54,0.95)' : 'rgba(255,255,255,0.95)',
            color: isDarkMode ? '#fff' : '#333',
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? 'rgba(65,227,255,0.3)' : 'rgba(25,118,210,0.3)'}`
          }
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#f87171' : '#ef4444' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDarkMode ? '#b5eaff' : '#1976d2' }}>
            Are you sure you want to delete <strong>"{valueToDelete}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: isDarkMode ? '#b5eaff' : '#1976d2' }}>Cancel</Button>
          <Button onClick={handleDeleteValue} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditInput;
