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

function getLgaName(path) {
  return path
    .getAttribute("fme:lga_name")
    .replace(/\s+/g, " ")
    .replace("Iguegben", "Igueben");
}

function decideWidth(area) {
  return (area < 1500) ? rectWidth = 1.2 : rectWidth = 2;
}

function decideHeight(area) {
  return (area < 1500) ? rectHeight = 0.6 : rectHeight = 1;
}
