describe('Resume Analysis Flow', () => {
  beforeEach(() => {
    // Start from the home page
    cy.visit('/');
    
    // Intercept API calls
    cy.intercept('POST', '**/api/analyze', {
      statusCode: 200,
      body: {
        match_score: 85,
        match_rating: 'Strong Match',
        missing_keywords: ['React', 'TypeScript'],
        suggestions: ['Add more technical skills', 'Include project experience'],
        resume_stats: {
          word_count: 500,
          readability_score: 75
        }
      }
    }).as('analyzeResume');
  });

  it('completes the full analysis flow successfully', () => {
    // 1. Click the CTA button on the home page
    cy.get('[data-testid="cta-button"]').click();

    // 2. Verify we're on the upload page
    cy.url().should('include', '/upload');

    // 3. Upload a resume file
    cy.get('[data-testid="drop-zone"]').attachFile('sample-resume.pdf', {
      subjectType: 'drag-n-drop'
    });

    // 4. Enter job description
    cy.get('[data-testid="job-description-input"]')
      .type('Senior React Developer position requiring TypeScript experience');

    // 5. Submit the form
    cy.get('[data-testid="analyze-button"]').click();

    // 6. Verify loading state
    cy.get('[data-testid="loading-modal"]').should('be.visible');

    // 7. Wait for API call to complete
    cy.wait('@analyzeResume');

    // 8. Verify results are displayed
    cy.get('[data-testid="match-score"]').should('contain', '85');
    cy.get('[data-testid="match-rating"]').should('contain', 'Strong Match');
    
    // Verify missing keywords
    cy.get('[data-testid="missing-keywords-list"]')
      .should('contain', 'React')
      .and('contain', 'TypeScript');

    // Verify suggestions
    cy.get('[data-testid="suggestions-list"]')
      .should('contain', 'Add more technical skills')
      .and('contain', 'Include project experience');

    // Verify resume stats
    cy.get('[data-testid="stats-container"]')
      .should('contain', '500')
      .and('contain', '75');
  });

  it('handles API errors gracefully', () => {
    // Intercept API call with error
    cy.intercept('POST', '**/api/analyze', {
      statusCode: 500,
      body: {
        detail: 'Failed to analyze resume'
      }
    }).as('analyzeResumeError');

    // Navigate to upload page
    cy.visit('/upload');

    // Upload file and enter job description
    cy.get('[data-testid="drop-zone"]').attachFile('sample-resume.pdf', {
      subjectType: 'drag-n-drop'
    });
    cy.get('[data-testid="job-description-input"]')
      .type('Sample job description');

    // Submit form
    cy.get('[data-testid="analyze-button"]').click();

    // Wait for API call
    cy.wait('@analyzeResumeError');

    // Verify error message
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Failed to analyze resume');
  });

  it('validates form inputs', () => {
    // Navigate to upload page
    cy.visit('/upload');

    // Try to submit without inputs
    cy.get('[data-testid="analyze-button"]').click();

    // Verify validation messages
    cy.get('[data-testid="resume-error"]')
      .should('be.visible')
      .and('contain', 'Please provide a resume');
    
    cy.get('[data-testid="job-description-error"]')
      .should('be.visible')
      .and('contain', 'Please provide a job description');
  });

  it('handles file type validation', () => {
    // Navigate to upload page
    cy.visit('/upload');

    // Try to upload an invalid file type
    cy.get('[data-testid="drop-zone"]').attachFile('invalid.txt', {
      subjectType: 'drag-n-drop'
    });

    // Verify error message
    cy.get('[data-testid="file-type-error"]')
      .should('be.visible')
      .and('contain', 'Please upload a PDF file');
  });
}); 