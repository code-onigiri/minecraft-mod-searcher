type ButtonVariant = 'primary' | 'ghost' | 'neutral';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  neutral: 'btn btn-neutral',
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const classes = `${variantClassMap[variant]} ${className}`.trim();
  return <button className={classes} {...props} />;
}
