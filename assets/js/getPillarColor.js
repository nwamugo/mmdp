const getPillarColor = pillarName => {
  switch (pillarName) {
    case 'Pillar 1':
      return '#00b050';
    case 'Pillar 2':
      return '#4472c4';
    case 'Pillar 3':
      return '#ffc000';
    case 'Pillar 4':
      return '#ed7d31';
    default:
      return 'none';
  }
};