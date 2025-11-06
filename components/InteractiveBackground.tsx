import React from 'react';

const InteractiveBackground: React.FC = () => {
    // A beautiful image that captures the essence of the one you provided.
    const imageUrl = 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                width: '100vw',
                height: '100vh',
                // Applying a semi-transparent overlay of the base color (#F2E4D8) to ensure readability and theme consistency
                backgroundImage: `linear-gradient(rgba(242, 228, 216, 0.7), rgba(242, 228, 216, 0.7)), url('${imageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
    );
};

export default InteractiveBackground;
