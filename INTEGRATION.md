# Assessment Micro-Frontend Integration Guide

This document explains how to integrate the Assessment Micro-Frontend into your main application.

## Overview

The Assessment Micro-Frontend provides standalone assessment experiences for:

1. **Language Proficiency** - Tests user's ability in different languages
2. **Contact Center Skills** - Evaluates skills relevant to contact center operations

## Integration Methods

### 1. Direct URL Navigation

The simplest integration method is to redirect users to a specific assessment URL.

#### Language Assessment URL Format:
```
https://your-assessment-domain.com/assessment/language/{LANGUAGE_NAME}?userId={USER_ID}&token={AUTH_TOKEN}&returnUrl={RETURN_URL}
```

#### Contact Center Assessment URL Format:
```
https://your-assessment-domain.com/assessment/contact-center/{SKILL_ID}?userId={USER_ID}&token={AUTH_TOKEN}&returnUrl={RETURN_URL}
```

#### URL Parameters:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `userId`    | Yes | The unique identifier for the user taking the assessment |
| `token`     | Yes | Authentication token for API access |
| `returnUrl` | Yes | URL to return to after assessment completion or exit |

#### Example:
```
https://assessments.example.com/assessment/language/Arabic?userId=12345&token=jwt.token.here&returnUrl=https://main-app.example.com/dashboard
```

### 2. IFrame Integration

You can embed the assessment as an iframe within your application:

```html
<iframe
  src="https://your-assessment-domain.com/assessment/language/Spanish?userId=12345&token=jwt.token.here"
  width="100%"
  height="700px"
  frameborder="0"
></iframe>
```

### 3. Standalone Deployment Mode

For development or internal use, you can run the micro-frontend in standalone mode by setting environment variables:

```
VITE_RUN_MODE=standalone
VITE_STANDALONE_USER_ID=your-test-user-id
VITE_STANDALONE_TOKEN=your-test-token
```

## Language Support

The language assessment supports any language name as input. The system will:

1. Take the language name from the URL (e.g., "Spanish", "Arabic", "Turkish", etc.)
2. Determine the ISO language code (either using a lookup table or AI)
3. Generate appropriate assessment content in that language

### Handling Non-Latin Language Names

For languages with non-Latin scripts, URL encode the language name:

```
/assessment/language/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9  (for "Русский")
```

## Authentication Flow

1. When a user is directed to the assessment, the micro-frontend checks for auth parameters in the URL
2. These parameters are stored in localStorage for persistence during the assessment
3. The token is used for all API calls to the backend
4. When the user completes or exits, they are directed back to the `returnUrl`

## API Communication

The micro-frontend communicates with your backend using these endpoints:

- `POST /api/assessments/language` - Saves language assessment results
- `POST /api/assessments/contact-center` - Saves contact center skill assessment results

Ensure your backend implements these endpoints to receive the assessment data.

## Styling Customization

The micro-frontend uses Tailwind CSS. To customize the appearance:

1. Fork the repository
2. Modify the `tailwind.config.js` file to match your brand colors
3. Deploy your customized version

## Troubleshooting

- **Authentication Errors**: Ensure the token is valid and has necessary permissions
- **Language Detection Issues**: For uncommon languages, try using the ISO code directly
- **Return URL Not Working**: Ensure the returnUrl is properly URL encoded 