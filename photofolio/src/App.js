import './App.css';
import FollowRecommendation from './components/FollowRecommendation';
import CreatePostModal from './components/CreatePostModal';

function App() {
  return (
    <div>
      <FollowRecommendation/>
      <div>
        <CreatePostModal/>
      </div>
    </div>
  );
}


export default App;
