INSERT OR IGNORE INTO papers (id, title, authors, url, year, status, tags, notes, created_at) VALUES
  (
    'paper001',
    'Attention Is All You Need',
    'Vaswani et al.',
    'https://arxiv.org/abs/1706.03762',
    '2017',
    'read',
    '["Transformers","NLP","ML"]',
    'The original transformer paper. Introduces multi-head self-attention and the encoder-decoder architecture.',
    '2024-01-01 00:00:00'
  ),
  (
    'paper002',
    'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    'Dosovitskiy et al.',
    'https://arxiv.org/abs/2010.11929',
    '2020',
    'read',
    '["Transformers","CV","ML"]',
    'Vision Transformer (ViT). Applies transformer architecture directly to image patches.',
    '2024-01-02 00:00:00'
  ),
  (
    'paper003',
    'Denoising Diffusion Probabilistic Models',
    'Ho et al.',
    'https://arxiv.org/abs/2006.11239',
    '2020',
    'reading',
    '["Diffusion","ML","CV"]',
    'DDPM. Foundation paper for modern diffusion-based generative models.',
    '2024-02-01 00:00:00'
  ),
  (
    'paper004',
    'Proximal Policy Optimization Algorithms',
    'Schulman et al.',
    'https://arxiv.org/abs/1707.06347',
    '2017',
    'to-read',
    '["RL","ML","Optimization"]',
    'PPO. A widely used on-policy RL algorithm balancing sample efficiency and stability.',
    '2024-03-01 00:00:00'
  ),
  (
    'paper005',
    'Constitutional AI: Harmlessness from AI Feedback',
    'Anthropic',
    'https://arxiv.org/abs/2212.08073',
    '2022',
    'to-read',
    '["Safety","ML","Agents"]',
    'CAI. Using AI-generated feedback to train safer models without human labelers for harmful content.',
    '2024-03-15 00:00:00'
  );
