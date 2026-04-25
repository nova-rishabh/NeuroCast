import axios from 'axios'; 
 
const BASE = '/api'; 
 
export const api = { 
  // Challenge 1 
  c1Predict: (text) => 
    axios.post(`${BASE}/challenge1/predict`, { text }), 
  c1Batch: (file) => { 
    const fd = new FormData(); fd.append('csv_file', file); 
    return axios.post(`${BASE}/challenge1/batch`, fd, { responseType: 'blob' }); 
  }, 
  c1Metrics: () => axios.get(`${BASE}/challenge1/metrics`), 
 
  // Challenge 2 
  c2Predict: (title, text, subject='', date='') => 
    axios.post(`${BASE}/challenge2/predict`, { title, text, subject, date }), 
  c2Batch: (file) => { 
    const fd = new FormData(); fd.append('csv_file', file); 
    return axios.post(`${BASE}/challenge2/batch`, fd, { responseType: 'blob' }); 
  }, 
  c2Metrics: () => axios.get(`${BASE}/challenge2/metrics`), 
 
  // Challenge 3 
  c3Predict: (text) => 
    axios.post(`${BASE}/challenge3/predict`, { text }), 
  c3Batch: (file) => { 
    const fd = new FormData(); fd.append('file', file); 
    return axios.post(`${BASE}/challenge3/batch`, fd, { responseType: 'blob' }); 
  }, 
  c3Metrics: () => axios.get(`${BASE}/challenge3/metrics`), 
 
  // Dashboard 
  dashboardMetrics: () => axios.get(`${BASE}/dashboard/metrics`), 
  downloadAll: () => 
    axios.get(`${BASE}/download/all`, { responseType: 'blob' }), 
}; 
 
export function downloadBlob(blob, filename) { 
  const url = URL.createObjectURL(blob); 
  const a = document.createElement('a'); 
  a.href = url; a.download = filename; a.click(); 
  URL.revokeObjectURL(url); 
} 
