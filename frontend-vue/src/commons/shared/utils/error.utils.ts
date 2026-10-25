export function getFriendlyError(rawMessage: string): string {
    const errorMap: Record<string, string> = {
        'errors.system_error': 'Si è verificato un errore imprevisto nel sistema. Riprova più tardi.',
        'errors.unauthorized': 'Sessione scaduta o non autorizzata. Effettua nuovamente l\'accesso.',
        'errors.forbidden': 'Non disponi dei permessi necessari per compiere questa azione.',
        'errors.bad_request': 'La richiesta non è valida. Verifica i dati inseriti.',
        'errors.conflict': 'Si è verificato un conflitto con i dati attuali. Riprova.',
        'errors.not_found': 'La risorsa richiesta non è stata trovata.',
        'errors.too_many_requests': 'Hai effettuato troppe richieste in poco tempo. Attendi qualche istante.',
        'errors.request_timeout': 'La richiesta è scaduta. Controlla la tua connessione internet.',
        'errors.validation_failed': 'I dati inseriti non sono validi. Controlla e riprova.',
    };

    return errorMap[rawMessage] || 'Si è verificato un errore inatteso. Riprova.';
}