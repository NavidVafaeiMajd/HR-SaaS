public class EventPublisher : IEventPublisher
{
    private readonly IServiceProvider _provider;

    public EventPublisher(IServiceProvider provider)
    {
        _provider = provider;
    }

    public async Task PublishAsync<TEvent>(TEvent @event)
        where TEvent : IEvent
    {
        var handlers =
            _provider.GetServices<IEventHandler<TEvent>>();

        foreach (var handler in handlers)
        {
            await handler.Handle(@event);
        }
    }
}