// =================================================================
// BACKEND (Server-side using Node.js and Express)
// =================================================================
//Set up:
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// This is our "database" of study links.
// In a real application, this would come from a database.
const studyLinks = {
    math: [
        { title: 'Khan Academy - Algebra Basics', url: 'https://www.khanacademy.org/math/algebra' },
        { title: 'Paul\'s Online Math Notes', url: 'http://tutorial.math.lamar.edu/Classes/Alg/Alg.aspx' },
        { title: 'Purplemath - Algebra Lessons', url: 'https://www.purplemath.com/modules/index.htm' },
        { title: 'Qayumi Page', url:'https://qayumi.weebly.com'},
        { title: 'Calculus Cheat Sheet', url: 'https://math.colorado.edu/math2300/resources/calc1/lamar/Calculus_Cheat_Sheet_All.pdf'},
        { title: 'Precalculus', url: 'https://www.onlinemathlearning.com/precalculus.html'},
        { title: 'Geometry Free Math Help', url: 'https://www.freemathhelp.com/geometry/'}
    ],
    science: [
        { title: 'American Chemical Society', url: 'https://www.acs.org/education/whatischemistry.html' },
        { title: 'Crash Course Chemistry - YouTube', url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr' },
        { title: 'ChemCollective Virtual Labs', url: 'http://chemcollective.org/vlabs' },
        { title: 'Chemistry', url: 'https://chemcollective.org/?utm_source=chatgpt.com'},
        { title: 'Biology', url: 'https://learn.genetics.utah.edu/?utm_source=chatgpt.com'},
        { title: 'ACT', url: 'https://study.com/buy/course/act.html?src=ppc_bing_nonbrand&rcntxt=aws&crt=77240852976730&kwd=act%20practice&kwid=kwd-77240731838412:loc-190&agid=1235851119867178&'}
    ],
    english: [
        { title: 'Purdue Online Writing Lab (OWL)', url: 'https://owl.purdue.edu/owl/purdue_owl.html' },
        { title: 'Grammarly', url: 'https://www.grammarly.com/' },
        { title: 'Project Gutenberg - Free eBooks', url: 'https://www.gutenberg.org/' },
        { title: 'MLA Citation Generator', url: 'https://www.easybib.com/mla/source'},
        { title: 'Citation Machine', url: 'https://www.citationmachine.net/'},
        { title: 'Free College Essay Resources', url: 'https://www.collegeessayguy.com/college-essay-resources'},
        { title: 'SAT English', url: 'https://satsuite.collegeboard.org/practice '}
    ],
    computerscience: [
        { title: 'Khan Academy - Computer Programming', url: 'https://www.khanacademy.org/computing/computer-programming' },
        { title: 'Github Project Example', url: 'https://github.com/kashika0573/Education-Project-Hack/blob/main/server.js'},
        { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
        { title: 'Python', url: 'https://realpython.com/?utm_source=chatgpt.com'},
        { title: 'Coding website (for most languages)', url: 'https://www.geeksforgeeks.org/'},
        { title: 'Java', url: 'https://www.tutorialspoint.com/java/index.htm?utm_source=chatgpt.com'}
    ]
};

// API Endpoint: When the frontend requests links for a subject, this code runs.
app.get('/api/links/:subject', (req, res) => {
    const subject = req.params.subject.toLowerCase();
    const links = studyLinks[subject];

    if (links) {
        res.json(links); // Send the links back as JSON
    } else {
        res.status(404).json({ error: 'Subject not found' });
    }
});

// Serve the main HTML page for the frontend
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study Helper</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f2f5;
            color: #1c1e21;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 600px;
            text-align: center;
        }
        h1 {
            color: #0d6efd;
            margin-bottom: 1.5rem;
        }
        #subjectSelector {
            font-size: 1rem;
            padding: 0.75rem;
            width: 100%;
            border-radius: 8px;
            border: 1px solid #ddd;
            margin-bottom: 2rem;
            cursor: pointer;
        }
        #linksContainer {
            text-align: left;
        }
        .link-card {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .link-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        .link-card a {
            text-decoration: none;
            font-weight: 600;
            color: #0056b3;
            font-size: 1.1rem;
        }
        .loading-text {
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Select a Subject to Study 📚</h1>
        <select id="subjectSelector">
            <option value="">-- Please choose a subject --</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="computerscience">Computer Science</option>
        </select>
        <div id="linksContainer">
            <!-- Study links will be dynamically inserted here -->
        </div>
    </div>

    <script>
        const subjectSelector = document.getElementById('subjectSelector');
        const linksContainer = document.getElementById('linksContainer');

        subjectSelector.addEventListener('change', async (event) => {
            const selectedSubject = event.target.value;
            linksContainer.innerHTML = ''; // Clear previous results

            if (!selectedSubject) {
                return; // Do nothing if the placeholder is selected
            }

            linksContainer.innerHTML = '<p class="loading-text">Fetching resources...</p>';

            try {
                // This is the API call from the frontend to the backend
                const response = await fetch(\`/api/links/\${selectedSubject}\`);
                const links = await response.json();

                // Clear the "Fetching..." message
                linksContainer.innerHTML = '';

                if (links.error) {
                    linksContainer.innerHTML = \`<p class="loading-text">\${links.error}</p>\`;
                } else {
                    // Create and display a card for each link
                    links.forEach(link => {
                        const linkCard = document.createElement('div');
                        linkCard.className = 'link-card';
                        linkCard.innerHTML = \`<a href="\${link.url}" target="_blank" rel="noopener noreferrer">\${link.title}</a>\`;
                        linksContainer.appendChild(linkCard);
                    });
                }
            } catch (error) {
                console.error('Failed to fetch links:', error);
                linksContainer.innerHTML = '<p class="loading-text">Could not load resources. Please try again later.</p>';
            }
        });
    </script>
</body>
</html>
`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
