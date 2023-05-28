const { useCallback, useState } = PreactHooks;

Chat.register('sidebar', (client) => function TimeButton() {
  const [time, setTime] = useState('Click to proble time');
  const click = useCallback(async () => {
    const { data: [currentTime] } = await client.req({ type: 'system:time' });
    setTime(currentTime.time);
  }, []);

  return (<div onClick={click}>{time}</div>);
});
