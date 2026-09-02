# README - UNO AI Technical College

## 🎓 Project Overview

This is the official website for **UNO AI Technical College**, a comprehensive static site built with HTML5, CSS3, and vanilla JavaScript. The site is deployed via GitHub Pages and served through Cloudflare's CDN.

**Live Site:** 
- GitHub Pages: https://shanta4100.github.io/uno-ai-technical-college
- Custom Domain: https://unoaitechcollege.com (coming soon)

---

## 📋 Project Structure

```
uno-ai-technical-college/
├── index.html              # Home page - hero, highlights, programs, testimonials
├── about.html              # About - mission, vision, story, values
├── programs.html           # Programs - certificates, diplomas, bootcamps
├── placements.html         # Placements - stats, hiring partners, careers
├── success-stories.html    # Success stories - testimonials and outcomes
├── admissions.html         # Admissions - application timeline and FAQs
├── contact.html            # Contact form and information
├── css/
│   └── style.css           # Main stylesheet - responsive design
├── js/
│   └── script.js           # JavaScript - nav toggle, form validation
├── images/                 # Images and media assets
├── CLOUDFLARE.md           # Cloudflare configuration guide
├── DEPLOYMENT.md           # GitHub Pages deployment guide
├── ANALYTICS.md            # Analytics and monitoring setup
├── CONTRIBUTING.md         # Contribution guidelines
└── README.md               # This file
```

---

## 🎨 Design & Features

### Responsive Design
- ✅ Mobile-first approach with breakpoints for tablets and desktops
- ✅ Touch-friendly navigation on mobile devices
- ✅ Flexible layouts using CSS Grid and Flexbox
- ✅ Tested on various screen sizes (320px - 2560px)

### Color Scheme
- **Primary Orange:** `#ff6b35` - Energy and innovation
- **Secondary Red:** `#dc143c` - Action and impact
- **Dark Navy:** `#1a1a1a` - Professional base
- **White:** `#ffffff` - Clean backgrounds

### Key Components
- **Header & Navigation:** Sticky header with mobile-responsive nav
- **Hero Section:** Compelling call-to-action with background image
- **Cards:** Reusable card components for programs and testimonials
- **Timelines:** Application process and program timeline
- **Forms:** Inquiry form with client-side validation
- **Footer:** Multi-column footer with social links

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shanta4100/uno-ai-technical-college.git
   cd uno-ai-technical-college
   ```

2. **Start a local server:**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (with http-server)
   npx http-server -p 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

---

## 📄 Page Details

### Home (`index.html`)
- Hero section with tagline and CTA
- Program highlights and quick overview
- Mission and vision preview
- Placement statistics
- Featured testimonials
- News and events preview
- Call-to-action buttons

### About (`about.html`)
- College mission statement
- Vision for the future
- Core values and principles
- History and founding story
- Achievement highlights
- Faculty expertise

### Programs (`programs.html`)
- **Certificate Courses:**
  - AI Fundamentals
  - Python Programming
  - Web Development
- **Diploma Programs:**
  - Data Analytics
  - Applied AI & Machine Learning
- **Bootcamps:**
  - Full-Stack Development
  - AI Engineering
- Course details, duration, and eligibility
- Enrollment information

### Placements (`placements.html`)
- 90%+ placement statistics
- Hiring partners and companies
- Career services overview
- Placement outcomes and data
- Alumni success stories
- Salary information

### Success Stories (`success-stories.html`)
- Student testimonials and achievements
- Faculty research highlights
- Before/after case studies
- Career progression stories
- Video testimonials section
- Industry recognition

### Admissions (`admissions.html`)
- 4-step application timeline
- Eligibility requirements
- Application process
- Frequently asked questions
- Scholarship information
- Important dates and deadlines

### Contact (`contact.html`)
- Contact form with validation
- Office locations and contact info
- Email: admissions@unoaitechcollege.edu
- Phone and business hours
- Map and directions
- Social media links

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, Animations
- **JavaScript (Vanilla)** - No frameworks, lightweight
- **Jekyll** - Static site generation (optional)
- **GitHub Pages** - Free hosting and deployment
- **Cloudflare** - CDN and performance optimization

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ⚙️ Configuration

### Jekyll Configuration (`_config.yml`)
```yaml
theme: jekyll-theme-minimal
title: UNO AI Technical College
description: Practical AI and tech training
markdown: kramdown
```

### GitHub Pages Deployment
- Source: Deploy from branch
- Branch: `main`
- Directory: `/ (root)`

See `DEPLOYMENT.md` for detailed setup instructions.

---

## 📊 Analytics & Monitoring

Set up Google Analytics and Cloudflare monitoring to track:
- Page views and unique visitors
- Traffic sources and referrals
- User engagement metrics
- Form submissions and inquiries
- Performance metrics

See `ANALYTICS.md` for detailed setup instructions.

---

## 🌐 Cloudflare Setup

Configure Cloudflare for:
- DNS management
- HTTPS/SSL encryption
- Performance optimization (caching, compression)
- Security (DDoS protection, WAF)
- Analytics and monitoring

See `CLOUDFLARE.md` for detailed setup instructions.

---

## 🔒 Security

- ✅ HTTPS enabled via Cloudflare
- ✅ Client-side form validation
- ✅ No sensitive data stored
- ✅ Content Security Policy headers
- ✅ Regular security updates

---

## ♻️ Performance Optimization

- ✅ Minified CSS and JavaScript
- ✅ Optimized images (WebP format)
- ✅ Lazy loading for images
- ✅ Cloudflare caching
- ✅ GZIP compression
- ✅ Fast DNS via Cloudflare

---

## 📝 Content Management

### Updating Content

1. **Edit HTML files directly** - Simple and no build required
2. **Update images** - Place in `/images` directory
3. **Modify CSS** - Update `/css/style.css`
4. **Add JavaScript** - Update `/js/script.js`

### Deployment

After making changes:
1. Commit and push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site updates within 1-2 minutes
4. Cloudflare cache updates within 5 minutes

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to:
- Report issues
- Submit pull requests
- Add new features
- Improve documentation

---

## 📞 Support & Troubleshooting

### Common Issues

**Site not updating?**
- Check GitHub Actions workflow status
- Clear browser cache (Ctrl+Shift+Delete)
- Wait 2-3 minutes for deployment

**Custom domain not working?**
- Verify DNS records in Cloudflare
- Wait 24-48 hours for DNS propagation
- Check CNAME file exists in repository root

**Contact form not working?**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify form field IDs match JavaScript

---

## 📄 License

This project is open source. Feel free to use and modify as needed.

---

## 👥 Contributors

- **Arifur Shanta** - Project owner and maintainer
- **Copilot SWE Agent** - Development assistance

---

## 🔗 Quick Links

- **Repository:** https://github.com/shanta4100/uno-ai-technical-college
- **Issues:** https://github.com/shanta4100/uno-ai-technical-college/issues
- **Pull Requests:** https://github.com/shanta4100/uno-ai-technical-college/pulls
- **Deployments:** https://github.com/shanta4100/uno-ai-technical-college/deployments
- **GitHub Pages Settings:** Repository Settings → Pages

---

## 📚 Additional Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/)
- [Cloudflare Docs](https://developers.cloudflare.com/)
- [HTML5 Best Practices](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- [CSS3 Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Last Updated:** September 2, 2026  
**Version:** 1.0.0
