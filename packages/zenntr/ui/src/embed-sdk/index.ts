
export class ZenntrEmbed {
    private static _config: { containerId: string; token: string; flowId: string } | null = null;

    static init(options: {
        containerId: string;
        token: string;
        flowId: string;
    }) {
        console.log('[Zenntr Embed SDK] Inicializando...', options);
        this._config = options;
        
        const container = document.getElementById(options.containerId);
        if (!container) {
            console.error(`[Zenntr Embed SDK] Container com ID '${options.containerId}' não encontrado.`);
            return;
        }

        // Limpa o container antes de injetar
        container.innerHTML = '';

        const iframe = document.createElement('iframe');
        // URL baseada na origem atual, assumindo que o builder é servido localmente ou configurado via env
        const builderUrl = window.location.origin; 
        iframe.src = `${builderUrl}/embed/builder/${options.flowId}?token=${options.token}`;
        
        // Estilização básica para garantir visibilidade
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        
        // Acessibilidade
        iframe.setAttribute('title', 'Activepieces Builder');
        
        container.appendChild(iframe);
        console.log('[Zenntr Embed SDK] Iframe injetado com sucesso.');

        // Configurar listener para mensagens postMessage (comunicação segura)
        window.addEventListener('message', this._handleMessage);
    }

    private static _handleMessage(event: MessageEvent) {
        // Validação de origem seria necessária aqui em produção
        if (event.data?.type === 'ZEN_FLOW_SAVED') {
            console.log('[Zenntr Embed SDK] Fluxo salvo!', event.data.payload);
        }
    }
    
    static destroy() {
        if (this._config?.containerId) {
            const container = document.getElementById(this._config.containerId);
            if (container) {
                container.innerHTML = '';
            }
        }
        window.removeEventListener('message', this._handleMessage);
        this._config = null;
    }
}
