import '@testing-library/jest-dom';

// Fix for TextEncoder error in jsdom
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
