
let coursesData = {};

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    console.log('🎯 App starting...');
    loadCoursesFromXML();
}

async function loadCoursesFromXML() {
    try {
        console.log('📥 Loading courses.xml...');
        const response = await fetch('courses.xml');
        
        if (!response.ok) {
            console.warn('⚠️ courses.xml not found, using fallback');
            loadFallbackData();
            return;
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const courses = xmlDoc.getElementsByTagName('course');
        
        // Parse ALL courses
        for (let course of courses) {
            const id = course.getAttribute('id');
            const instructor = course.getElementsByTagName('instructor')[0];
            
            coursesData[id] = {
                title: course.getElementsByTagName('title')[0].textContent,
                price: course.getElementsByTagName('price')[0].textContent,
                rating: instructor ? instructor.getElementsByTagName('rating')[0].textContent : '4.5',
                instructor: instructor ? instructor.getElementsByTagName('name')[0].textContent : 'Expert Instructor'
            };
        }
        
        updateCards();
        console.log('✅ Loaded', Object.keys(coursesData).length, 'courses');
        
    } catch (error) {
        console.error('XML Error:', error);
        loadFallbackData();
    }
}

function loadFallbackData() {
    coursesData = {
        web: { title: 'Web Development', price: '₹9,999', rating: '4.9', instructor: 'John Doe' },
        python: { title: 'Python Programming', price: '₹8,499', rating: '4.8', instructor: 'Sarah Johnson' },
        devops: { title: 'DevOps', price: '₹12,999', rating: '4.9', instructor: 'Mike Chen' },
        flutter: { title: 'Flutter Development', price: '₹7,999', rating: '4.7', instructor: 'Emily Davis' },
        blockchain: { title: 'Blockchain', price: '₹14,999', rating: '4.9', instructor: 'Alexander Wang' }
    };
    updateCards();
}

function updateCards() {
    // Update ratings & prices on cards
    ['web', 'python', 'devops', 'flutter', 'blockchain'].forEach(id => {
        const course = coursesData[id];
        if (course) {
            const ratingEl = document.getElementById(`rating-${id}`);
            const priceEl = document.getElementById(`price-${id}`);
            if (ratingEl) ratingEl.textContent = `⭐ ${course.rating}`;
            if (priceEl) priceEl.textContent = course.price;
        }
    });
}

// ⭐ MAIN FUNCTION - PERFECT COURSE DETAILS
function showCourse(courseId) {
    const course = coursesData[courseId];
    if (!course) {
        document.getElementById('courseDetails').innerHTML = '<p style="color:red;">Course not found!</p>';
        return;
    }
    
    const details = document.getElementById('courseDetails');
    details.classList.add('show');
    
    // Generate 5-star rating
    const stars = generateStarRating(course.rating);
    
    details.innerHTML = `
        <div style="
            max-width: 900px; 
            margin: 0 auto; 
            padding: 30px; 
            background: rgba(255,255,255,0.95); 
            border-radius: 25px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        ">
            <!-- COURSE TITLE -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                padding: 30px; 
                border-radius: 20px; 
                text-align: center; 
                margin-bottom: 30px;
            ">
                <h1 style="font-size: 2.5rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ${course.title}
                </h1>
            </div>
            
            <!-- INFO CARDS GRID -->
            <div style="display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                        gap: 25px; 
                        margin-bottom: 40px;">
                
                <!-- INSTRUCTOR CARD -->
                <div style="
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white; 
                    padding: 30px 25px; 
                    border-radius: 20px; 
                    text-align: center;
                    box-shadow: 0 15px 35px rgba(52,152,219,0.3);
                ">
                    <div style="font-size: 3rem; margin-bottom: 15px;">👨‍🏫</div>
                    <h3 style="margin: 0 0 15px 0; font-size: 1.3rem;">Instructor</h3>
                    <div style="font-size: 1.6rem; font-weight: bold; margin-top: 10px;">
                        ${course.instructor}
                    </div>
                </div>
                
                <!-- PRICE CARD -->
                <div style="
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                    color: white; 
                    padding: 30px 25px; 
                    border-radius: 20px; 
                    text-align: center;
                    box-shadow: 0 15px 35px rgba(39,174,96,0.4);
                ">
                    <div style="font-size: 3rem; margin-bottom: 15px;">💰</div>
                    <h3 style="margin: 0 0 15px 0; font-size: 1.3rem;">Price</h3>
                    <div style="font-size: 2.5rem; font-weight: bold; margin-top: 5px;">
                        ${course.price}
                    </div>
                </div>
                
                <!-- RATING CARD -->
                <div style="
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    color: white; 
                    padding: 30px 25px; 
                    border-radius: 20px; 
                    text-align: center;
                    box-shadow: 0 15px 35px rgba(243,156,18,0.4);
                ">
                    <div style="font-size: 3rem; margin-bottom: 15px;">⭐</div>
                    <h3 style="margin: 0 0 15px 0; font-size: 1.3rem;">Ratings</h3>
                    <div style="font-size: 2.2rem; font-weight: bold; margin: 10px 0;">
                        ${course.rating}
                    </div>
                    <div style="font-size: 1.8rem;">${stars}</div>
                </div>
                
            </div>
            
            <!-- ACTION BUTTONS -->
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <button onclick="enrollCourse('${courseId}')" 
                        style="
                        background: linear-gradient(45deg, #e74c3c, #c0392b);
                        color: white; 
                        padding: 20px 50px; 
                        border: none; 
                        border-radius: 50px; 
                        font-size: 1.3rem; 
                        font-weight: bold; 
                        cursor: pointer; 
                        box-shadow: 0 10px 30px rgba(231,76,60,0.4);
                        transition: all 0.3s ease;
                        ">
                    🚀 Enroll Now - ${course.price}
                </button>
                <button onclick="closeCourseDetails()" 
                        style="
                        background: linear-gradient(45deg, #95a5a6, #7f8c8d);
                        color: white; 
                        padding: 20px 30px; 
                        border: none; 
                        border-radius: 50px; 
                        font-size: 1.1rem; 
                        font-weight: bold; 
                        cursor: pointer; 
                        transition: all 0.3s ease;
                        ">
                    ✕ Close Details
                </button>
            </div>
        </div>
    `;
    
    // Scroll to top of details
    document.querySelector('#details').scrollIntoView({ behavior: 'smooth' });
}

function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '⭐';
        } else if (i === fullStars && hasHalf) {
            stars += '⭐';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

function enrollCourse(courseId) {
    const course = coursesData[courseId];
    alert(`🎉 Enrollment Successful!\n\n` +
          `Course: ${course.title}\n` +
          `Instructor: ${course.instructor}\n` +
          `Price: ${course.price}\n` +
          `Rating: ${course.rating}⭐\n\n` +
          `Redirecting to registration...`);
    
    document.querySelector('#register').scrollIntoView({ behavior: 'smooth' });
}

function closeCourseDetails() {
    document.getElementById('courseDetails').innerHTML = '<p>Click on a course to see details</p>';
    document.getElementById('courseDetails').classList.remove('show');
}

function validateForm() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;
    
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return false;
    }
    
    alert('✅ Registration successful! Welcome to My Learning Platform! 🎉');
    return false;
}