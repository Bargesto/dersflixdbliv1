import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Video } from '../types';
import VideoGrid from './VideoGrid';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';

const Dashboard = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosRef = collection(db, 'videos');
        let q = query(videosRef);
        
        // If user is logged in, only fetch their videos
        if (user) {
          q = query(videosRef, where('userId', '==', user.id));
        }

        const querySnapshot = await getDocs(q);
        const fetchedVideos: Video[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedVideos.push({ id: doc.id, ...doc.data() } as Video);
        });
        
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  const classes = ['all', ...new Set(videos.map(video => video.class))];
  const subjects = ['all', ...new Set(videos.map(video => video.subject))];

  const filteredVideos = videos.filter(video => {
    const matchesClass = selectedClass === 'all' || video.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    return matchesClass && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          {classes.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Classes' : `Class ${c}`}
            </option>
          ))}
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          {subjects.map(s => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Subjects' : s}
            </option>
          ))}
        </select>
      </div>
      {!user && (
        <div className="bg-gray-800 p-4 rounded-md text-center">
          Please login to add and manage your own videos
        </div>
      )}
      <VideoGrid videos={filteredVideos} />
    </div>
  );
};

export default Dashboard;