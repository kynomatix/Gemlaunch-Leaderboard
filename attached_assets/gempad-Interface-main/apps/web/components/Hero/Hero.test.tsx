// import '@testing-library/jest-dom/jest-globals';
// import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import Hero from './Hero';

test('renders heading correctly', () => {
    render(<Hero />);
    const text = 'Unleash Your Gem with Gemlaunch: Decentralized Token Sales Simplified';
    const textElement = screen.getByText(text);
    expect(textElement).toBeInTheDocument();
});
