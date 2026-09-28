import axios, { AxiosHeaders } from 'axios';

const eventSeed = [
  { id: 'code-sprint', category: 'Coding', fee: 450, seats: 60, date: 'Oct 12 · 9:00 AM', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'robowars', category: 'Robotics', fee: 350, seats: 32, date: 'Oct 12 · 1:30 PM', image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'neural-nights', category: 'AI', fee: 250, seats: 45, date: 'Oct 12 · 3:00 PM', image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'pixel-perfect', category: 'Web Dev', fee: 200, seats: 50, date: 'Oct 13 · 10:00 AM', image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'valorant-open', category: 'Gaming', fee: 300, seats: 24, date: 'Oct 13 · 2:00 PM', image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'design-jam', category: 'Design', fee: 150, seats: 40, date: 'Oct 13 · 4:30 PM', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'startup-pitch', category: 'Innovation', fee: 100, seats: 36, date: 'Oct 14 · 11:00 AM', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { id: 'proshow', category: 'Live', fee: 600, seats: 100, date: 'Oct 14 · 6:30 PM', image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1000' }
];

const eventContent = [
  ['Code Sprint: Build Beyond', 'A fast-paced team hackathon. Turn a bold idea into a working prototype before the clock runs out.', '24-hour build'],
  ['RoboWars: Arena Zero', 'Put your custom-built bot to the test in a high-energy knockout tournament.', 'Live arena'],
  ['Neural Nights', 'Explore practical machine learning through hands-on challenges, demos, and mentor-led labs.', 'Hands-on lab'],
  ['Pixel Perfect Web Jam', 'Design and ship a polished, accessible web experience in this creative front-end sprint.', 'Build challenge'],
  ['Valorant Open', 'Form a squad, compete through the brackets, and play for the campus championship.', 'Campus esports'],
  ['Design Jam: Future Forms', 'Collaborate on a fresh digital product concept and present your prototype to the jury.', 'Creative sprint'],
  ['Startup Pitch Lab', 'Pitch a technology idea, sharpen your story, and get feedback from founders and mentors.', 'Pitch session'],
  ['TechFest Live: Afterglow', 'Close out three days of ideas and invention with an unforgettable live music night.', 'Festival finale']
];

const mockAdapter = async config => {
  await new Promise(resolve => window.setTimeout(resolve, 450));
  if (config.signal?.aborted) throw new axios.CanceledError('Event request was cancelled.');

  return {
    data: eventSeed.map((event, index) => ({
      ...event,
      title: eventContent[index][0],
      description: eventContent[index][1],
      tag: eventContent[index][2]
    })),
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config
  };
};

export async function getEvents({ signal } = {}) {
  const response = await axios.get('/api/events', { adapter: mockAdapter, signal });
  return response.data;
}
