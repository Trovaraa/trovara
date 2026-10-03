/** Refresh stale clients on an update, not on a first-time worker installation. */
export function reloadOnWorkerUpdate(
  serviceWorker: Pick<ServiceWorkerContainer, 'controller' | 'addEventListener'>,
  reload: () => void,
): void {
  let previousController = serviceWorker.controller
  let refreshing = false

  serviceWorker.addEventListener('controllerchange', () => {
    const nextController = serviceWorker.controller
    if (!nextController || nextController === previousController) return

    const isUpdate = previousController !== null
    previousController = nextController
    // A first visit already loaded the current assets from the network. Claiming
    // that page must not interrupt rendering, entered form data or navigation.
    if (!isUpdate || refreshing) return
    refreshing = true
    reload()
  })
}
