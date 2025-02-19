
import JEditor from "./components/JEditor";
// import EditorPanel from "./components/EditorPanel"
// import Terminal from "./components/Terminal"
import { LANGUAGE_CONFIG } from "./constants";


function App() {
    const languageLabels = Object.values(LANGUAGE_CONFIG)
    console.log(languageLabels)
  
  return(
   <div>
    <JEditor/>
    {/* <Terminal/> */}
   </div>
)
}

export default App
