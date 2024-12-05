const fs = require('fs');
const path = require('path');

// Read data from the data.json file
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to create directories and files
async function createDirectoriesAndFiles() {
  // Loop through the chapters
  for (const [chapterIndex, chapter] of data.Chapters.entries()) {
    // Create a folder for each chapter (e.g., Ch 1 Variables)
    const chapterFolderName = `Ch ${chapterIndex + 1} ${chapter.Title}`;
    const chapterFolderPath = path.join(__dirname, chapterFolderName);
    if (!fs.existsSync(chapterFolderPath)) {
      fs.mkdirSync(chapterFolderPath);
    }

    // Loop through the lessons within the chapter
    for (const lesson of chapter.Lessons) {
      // Create a folder for each lesson (e.g., Learn Go (for Developers))
      const lessonFolderName = lesson.Title;
      const lessonFolderPath = path.join(chapterFolderPath, lessonFolderName);
      if (!fs.existsSync(lessonFolderPath)) {
        fs.mkdirSync(lessonFolderPath);
      }

      // Fetch the lesson content from the API using the lesson UUID
      try {
        const apiUrl = `https://api.boot.dev/v1/static/lessons/${lesson.UUID}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const lessonData = await response.json();

        // Extract content for main.go (index 0)
        let mainGoContent = lessonData.Lesson.LessonDataCodeTests?.StarterFiles?.[0]?.Content;
        if (!mainGoContent) {        
            mainGoContent = lessonData.Lesson.LessonDataCodeCompletion?.StarterFiles?.[0]?.Content;
            if (!mainGoContent) {
              console.log(`main.go content not found for lesson: ${lesson.Title}`);
              continue;
            }
        }
      
        // Create and write the main.go file
        const mainGoPath = path.join(lessonFolderPath, 'main.go');
        fs.writeFileSync(mainGoPath, mainGoContent, 'utf8');
        console.log(`main.go created for lesson: ${lesson.Title}`);  

        // Extract content for main_test.go (index 2)
        const mainTestGoContent = lessonData.Lesson.LessonDataCodeTests?.StarterFiles?.[2]?.Content;
        if (!mainTestGoContent) {
          console.log(`main_test.go content not found for lesson: ${lesson.Title}`);
          continue;
        }

        // Create and write the main_test.go file
        const mainTestGoPath = path.join(lessonFolderPath, 'main_test.go');
        fs.writeFileSync(mainTestGoPath, mainTestGoContent, 'utf8');
        console.log(`main_test.go created for lesson: ${lesson.Title}`);

      } catch (error) {
        console.error(`Error fetching lesson data for lesson: ${lesson.Title}`, error);
      }
    }
  }
}

// Execute the function to create the directories and files
createDirectoriesAndFiles().then(() => {
  console.log('Folders and files created successfully!');
}).catch((error) => {
  console.error('Error creating directories and files:', error);
});
