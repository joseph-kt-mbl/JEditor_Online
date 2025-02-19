import { useCodeEditorStore } from "../store/useCodeEditorStore"

const Terminal = () => {
    const {executionResult} = useCodeEditorStore()

  return (
        <p>{executionResult?.output }</p>
      )
}

export default Terminal