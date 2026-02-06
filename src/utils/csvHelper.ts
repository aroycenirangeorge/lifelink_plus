// Local CSV Helper for cross-page data sharing
class LocalCSV {
  private campFileName = 'lifelink_camp_posts.csv';
  private requirementFileName = 'lifelink_requirement_posts.csv';
  private ngoFileName = 'lifelink_ngo_posts.csv';

  // Convert post object to CSV row
  postToCSVRow(post: any): string {
    const row = [
      post.id || '',
      post.type || '',
      post.title || '',
      post.location || '',
      post.date || '',
      post.time || '',
      post.organizer || '',
      post.contact || '',
      post.bloodGroup || '',
      post.units || '',
      post.urgency || '',
      post.description || '',
      post.timestamp ? new Date(post.timestamp).toISOString() : ''
    ];
    return row.map(cell => `"${cell}"`).join(',') + '\n';
  }

  // Convert CSV row back to post object
  csvRowToPost(row: string[], type: string): any {
    return {
      id: parseInt(row[0]) || Date.now(),
      type: type,
      title: row[2] || '',
      location: row[3] || '',
      date: row[4] || '',
      time: row[5] || '',
      organizer: row[6] || '',
      contact: row[7] || '',
      bloodGroup: row[8] || '',
      units: parseInt(row[9]) || 0,
      urgency: row[10] || '',
      description: row[11] || '',
      timestamp: row[12] ? new Date(row[12]) : new Date()
    };
  }

  // Download posts as separate CSV files by type
  downloadCSVByType(posts: any[]): void {
    const headers = ['ID', 'Type', 'Title', 'Location', 'Date', 'Time', 'Organizer', 'Contact', 'Blood Group', 'Units', 'Urgency', 'Description', 'Timestamp'];
    
    // Separate posts by type
    const campPosts = posts.filter(p => p.type === 'camp');
    const requirementPosts = posts.filter(p => p.type === 'requirement');
    const ngoPosts = posts.filter(p => p.type === 'ngo');
    
    // Download camp posts
    if (campPosts.length > 0) {
      const campCSV = headers.join(',') + '\n' + campPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(campCSV, this.campFileName);
    }
    
    // Download requirement posts
    if (requirementPosts.length > 0) {
      const requirementCSV = headers.join(',') + '\n' + requirementPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(requirementCSV, this.requirementFileName);
    }
    
    // Download NGO posts
    if (ngoPosts.length > 0) {
      const ngoCSV = headers.join(',') + '\n' + ngoPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(ngoCSV, this.ngoFileName);
    }
    
    if (campPosts.length === 0 && requirementPosts.length === 0 && ngoPosts.length === 0) {
      console.error('No posts to download');
    }
  }

  // Generic file download helper
  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Parse CSV file content by type
  parseCSVByType(csvContent: string, type: string): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const posts: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = this.parseCSVLine(lines[i]);
      if (row.length >= 13) {
        posts.push(this.csvRowToPost(row, type));
      }
    }
    return posts;
  }

  // Parse CSV line handling quoted commas
  parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  // Save to localStorage as separate backups
  saveToLocalStorageByType(posts: any[]): void {
    const campPosts = posts.filter(p => p.type === 'camp');
    const requirementPosts = posts.filter(p => p.type === 'requirement');
    const ngoPosts = posts.filter(p => p.type === 'ngo');
    
    localStorage.setItem('lifelink_camp_posts_backup', JSON.stringify(campPosts));
    localStorage.setItem('lifelink_requirement_posts_backup', JSON.stringify(requirementPosts));
    localStorage.setItem('lifelink_ngo_posts_backup', JSON.stringify(ngoPosts));
  }

  // Load from localStorage backups
  loadFromLocalStorageByType(): any[] {
    const campPosts = JSON.parse(localStorage.getItem('lifelink_camp_posts_backup') || '[]');
    const requirementPosts = JSON.parse(localStorage.getItem('lifelink_requirement_posts_backup') || '[]');
    const ngoPosts = JSON.parse(localStorage.getItem('lifelink_ngo_posts_backup') || '[]');
    
    return [...campPosts, ...requirementPosts, ...ngoPosts];
  }

  // Clear all CSV data
  clearAllCSVData(): void {
    localStorage.removeItem('lifelink_camp_posts_backup');
    localStorage.removeItem('lifelink_requirement_posts_backup');
    localStorage.removeItem('lifelink_ngo_posts_backup');
  }

  // Get specific type posts
  getCampPosts(): any[] {
    return JSON.parse(localStorage.getItem('lifelink_camp_posts_backup') || '[]');
  }

  getRequirementPosts(): any[] {
    return JSON.parse(localStorage.getItem('lifelink_requirement_posts_backup') || '[]');
  }

  getNGOPosts(): any[] {
    return JSON.parse(localStorage.getItem('lifelink_ngo_posts_backup') || '[]');
  }
}

export const localCSV = new LocalCSV();
