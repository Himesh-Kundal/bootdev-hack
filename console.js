(async () => {
    try {    
      const pathParts = window.location.pathname.split('/');
      const lessonId = pathParts[pathParts.length - 1]; // Last part is the lessonId
    
      console.log("Fetching lesson with ID:", lessonId);
  
      const apiUrl = `https://api.boot.dev/v1/static/lessons/${lessonId}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extract content for main.go (index 0)
      let mainGoContent = data.Lesson.LessonDataCodeTests?.StarterFiles?.[0]?.Content;
      if (!mainGoContent) {
        mainGoContent = data.Lesson.LessonDataCodeCompletion?.StarterFiles?.[0]?.Content;
        if (!mainGoContent) {
          console.log(`main.go content not found`);
          return;
        }
      }

      // Create and download the main.go file
      const mainGoBlob = new Blob([mainGoContent], { type: 'text/plain' });
      const mainGoUrl = URL.createObjectURL(mainGoBlob);
      const mainGoLink = document.createElement('a');
      mainGoLink.href = mainGoUrl;
      mainGoLink.download = 'main.go';
      mainGoLink.click();
      URL.revokeObjectURL(mainGoUrl);
  
      // Extract content for main_test.go (index 2)
      const mainTestGoContent = data.Lesson.LessonDataCodeTests?.StarterFiles?.[2]?.Content;
      if (!mainTestGoContent) {
        console.log("main_test.go Content not found.");
        return;
      }
  
      // Create and download the main_test.go file
      const mainTestGoBlob = new Blob([mainTestGoContent], { type: 'text/plain' });
      const mainTestGoUrl = URL.createObjectURL(mainTestGoBlob);
      const mainTestGoLink = document.createElement('a');
      mainTestGoLink.href = mainTestGoUrl;
      mainTestGoLink.download = 'main_test.go';
      mainTestGoLink.click();
      URL.revokeObjectURL(mainTestGoUrl);
  
    } catch (error) {
      console.error("Error fetching or processing the lesson data:", error);
    }
  })();
  