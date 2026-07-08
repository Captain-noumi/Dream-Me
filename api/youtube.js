// Curated mock videos mapping for flagship domains and general topics
const MOCK_VIDEOS = {
  // Software engineering
  "zJsK70GZ3Dw": {
    videoId: "zJsK70GZ3Dw",
    title: "How to become a Software Engineer - The Ultimate Roadmap",
    channelTitle: "Developer Career Paths",
    description: "A complete step-by-step masterclass guiding you from zero programming experience to landing your first job as a software engineer.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop"
  },
  // Data science
  "KxryzSO1Fjs": {
    videoId: "KxryzSO1Fjs",
    title: "Data Science Roadmap - Learn Data Science in 12 Months",
    channelTitle: "DataInsight",
    description: "An industry-expert guide on statistics, Python, machine learning, and database queries you need to break into data science.",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop"
  },
  // UI UX Design
  "c9Wg6Ry_zmo": {
    videoId: "c9Wg6Ry_zmo",
    title: "UI/UX Design Masterclass - Roadmap for Beginners",
    channelTitle: "DesignAcademy",
    description: "Learn figma, user testing, wireframing, and visual principles. Discover how to create premium digital experiences.",
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop"
  },
  // Game dev
  "z06QR-y1LkA": {
    videoId: "z06QR-y1LkA",
    title: "Game Development Guide: From Concept to Launch",
    channelTitle: "PixelCraft",
    description: "Explore the game design loop, math engines, asset creations, and Unity/Unreal scripting guidelines.",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop"
  },
  // Finance
  "g8ZzP94V9i0": {
    videoId: "g8ZzP94V9i0",
    title: "Corporate Finance and Valuation Basics",
    channelTitle: "Financial Analyst Group",
    description: "Master accounting basics, cash flow models, and portfolio management techniques to jumpstart your career in finance.",
    thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop"
  },
  // Digital marketing
  "j5mC3B-iW3M": {
    videoId: "j5mC3B-iW3M",
    title: "Digital Marketing Complete Roadmap for Beginners",
    channelTitle: "MarketMinds",
    description: "Understand SEO, SEM, content strategy, email outreach, conversion rate optimization, and advertising metrics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"
  },
  // Biology
  "F37n45Pq-yY": {
    videoId: "F37n45Pq-yY",
    title: "Introduction to Life Sciences and Biology Careers",
    channelTitle: "ScienceHub",
    description: "An overview of cellular biology, genetics research, bio-statistics, lab mechanics, and biotech opportunities.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"
  },
  // Psychology
  "vo4pMVb0R6M": {
    videoId: "vo4pMVb0R6M",
    title: "Psychology Careers & Paths - Learn to Help Others",
    channelTitle: "Insightful Minds",
    description: "Explore developmental psychology, cognitive behaviors, clinical methods, research theories, and counseling protocols.",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop"
  }
};

const getGenericMockVideo = (query) => {
  return {
    videoId: "dQw4w9WgXcQ", // Elegant fallback or customizable
    title: `Ultimate Career Masterclass & Roadmap: ${query || "Your Dream Path"}`,
    channelTitle: "Dream Me Education",
    description: `A comprehensive overview and roadmap explaining how to break into the field of ${query || "your chosen career"} with modern guidelines and industry strategies.`,
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop"
  };
};

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.YOUTUBE_APIKEY;
  const { q, videoId } = req.query;

  // 1. Check if apiKey is present. If not, use mock database
  if (!apiKey) {
    console.log("YouTube API key not configured. Serving mock video data.");
    return serveMock(videoId, q, res);
  }

  try {
    if (videoId) {
      // Fetch details for a specific video ID
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`YouTube API returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return res.status(200).json({
          videoId: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url
        });
      } else {
        // Not found, fall back to mock
        return serveMock(videoId, q, res);
      }
    } else if (q) {
      // Search for the query
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(q + ' career roadmap masterclass')}&type=video&key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`YouTube API returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return res.status(200).json({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url
        });
      } else {
        return serveMock(null, q, res);
      }
    } else {
      return res.status(400).json({ error: 'Missing parameter q or videoId' });
    }

  } catch (error) {
    console.error('YouTube API error:', error);
    // Graceful fallback to prevent app crashing on client
    return serveMock(videoId, q, res, error.message);
  }
}

function serveMock(videoId, q, res, errorMsg = null) {
  let videoData = null;
  if (videoId && MOCK_VIDEOS[videoId]) {
    videoData = MOCK_VIDEOS[videoId];
  } else if (q) {
    // Check if we can find a keyword match in our flagship videos
    const key = Object.keys(MOCK_VIDEOS).find(vidId => {
      const titleMatches = MOCK_VIDEOS[vidId].title.toLowerCase().includes(q.toLowerCase());
      const descMatches = MOCK_VIDEOS[vidId].description.toLowerCase().includes(q.toLowerCase());
      return titleMatches || descMatches;
    });
    videoData = key ? MOCK_VIDEOS[key] : getGenericMockVideo(q);
  } else {
    videoData = getGenericMockVideo("Career Path");
  }

  return res.status(200).json({
    ...videoData,
    isMock: true,
    apiError: errorMsg
  });
}
