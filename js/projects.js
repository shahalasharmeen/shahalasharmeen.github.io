/**
 * Projects Showcase Category Filter Controller - Pure Vanilla JS
 * Snappy Emil Kowalski transitions and Hallmark accessibility
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.work-card');
  const countBadge = document.getElementById('project-result-count');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const category = this.getAttribute('data-filter');

      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      let visibleCount = 0;

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = `${visibleCount} System${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });
});
