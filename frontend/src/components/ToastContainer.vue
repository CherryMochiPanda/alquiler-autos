<template>
  <div class="toast-root" aria-live="polite">
    <div v-for="t in notification.toasts" :key="t.id" class="toast" :class="t.type">
      <div class="toast-message">{{ t.message }}</div>
      <button type="button" class="close-btn" @click.stop="notification.removeToast(t.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/useNotificationStore'

const notification = useNotificationStore()
</script>

<style scoped>
 .toast-root {
   position: fixed;
   right: 1rem;
   top: 6rem;
   display: flex;
   flex-direction: column-reverse;
   gap: 0.75rem;
   z-index: 9999;
   pointer-events: none;
 }
 
  .toast {
   background: rgba(0, 0, 0, 0.8);
   color: var(--text-color);
   padding: 0.75rem 1rem;
   border-radius: 8px;
   min-width: 280px;
   max-width: 400px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 1rem;
   pointer-events: auto;
   animation: slideInRight 0.3s ease;
   backdrop-filter: blur(8px);
   border: 1px solid rgba(255, 255, 255, 0.1);
 }
 
 .toast-message {
   flex: 1;
   font-size: 0.95rem;
   line-height: 1.4;
 }
 
 .toast-info {
   background: rgba(33, 150, 243, 0.9);
   border-color: rgba(33, 150, 243, 0.5);
  color: var(--text-on-accent);
 }
 
 .toast-success {
   background: rgba(76, 175, 80, 0.9);
   border-color: rgba(76, 175, 80, 0.5);
  color: var(--text-on-accent);
 }
 
 .toast-warning {
   background: rgba(255, 152, 0, 0.9);
   border-color: rgba(255, 152, 0, 0.5);
  color: var(--text-on-accent);
 }
 
 .toast-error {
   background: rgba(244, 67, 54, 0.9);
   border-color: rgba(244, 67, 54, 0.5);
  color: var(--text-on-accent);
 }
 
 .close-btn {
   background: none;
   border: none;
   color: inherit;
   font-size: 1.2rem;
   cursor: pointer;
   line-height: 1;
   transition: opacity 0.2s ease;
   flex-shrink: 0;
   padding: 0.25rem 0.45rem;
   border-radius: 6px;
 }
 
 .close-btn:hover {
   opacity: 0.8;
   background: rgba(255,255,255,0.08);
 }
 
 .close-btn:active {
   opacity: 0.6;
 }
 
 /* Animations */
 @keyframes slideInRight {
   from {
     opacity: 0;
     transform: translateX(100%) translateY(-10px);
   }
   to {
     opacity: 1;
     transform: translateX(0) translateY(0);
   }
 }
 
 .toast-list-enter-active,
 .toast-list-leave-active {
   transition: all 0.3s ease;
 }
 
 .toast-list-enter-from {
   opacity: 0;
   transform: translateX(100%);
 }
 
 .toast-list-leave-to {
   opacity: 0;
   transform: translateX(100%);
 }
 
 /* Responsive */
 @media (max-width: 640px) {
   .toast-root {
     left: 0.5rem;
     right: 0.5rem;
     top: 5rem;
   }
 
   .toast {
     min-width: auto;
     max-width: none;
   }
 }
</style>
