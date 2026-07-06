import { useCounterStore } from '@entities/counter/model/store';
import { fireEvent, render } from '@testing-library/react-native';
import { CounterButton } from '../CounterButton';

describe('CounterButton', () => {
  beforeEach(() => {
    useCounterStore.getState().reset();
  });

  it('renders the initial count of 0', async () => {
    const { getByText } = await render(<CounterButton />);
    expect(getByText('Zustand Counter: 0')).toBeTruthy();
  });

  it('increments the count when +1 is pressed', async () => {
    const { getByText, getByTestId } = await render(<CounterButton />);
    const incrementBtn = getByTestId('increment-btn');

    await fireEvent.press(incrementBtn);

    expect(getByText('Zustand Counter: 1')).toBeTruthy();
  });

  it('decrements the count when -1 is pressed', async () => {
    const { getByText, getByTestId } = await render(<CounterButton />);
    const decrementBtn = getByTestId('decrement-btn');

    await fireEvent.press(decrementBtn);

    expect(getByText('Zustand Counter: -1')).toBeTruthy();
  });

  it('resets the count when Reset is pressed', async () => {
    const { getByText, getByTestId } = await render(<CounterButton />);
    const incrementBtn = getByTestId('increment-btn');
    const resetBtn = getByTestId('reset-btn');

    await fireEvent.press(incrementBtn);
    await fireEvent.press(incrementBtn);
    expect(getByText('Zustand Counter: 2')).toBeTruthy();

    await fireEvent.press(resetBtn);
    expect(getByText('Zustand Counter: 0')).toBeTruthy();
  });
});
